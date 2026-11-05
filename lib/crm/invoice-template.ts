import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

export interface InvoiceTemplateLine {
  description: string;
  rate: number;
  qty: number;
  subLines?: string[];
}

export interface InvoiceTemplateInput {
  clientName: string;
  clientCompany?: string;
  clientAddress?: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  items: InvoiceTemplateLine[];
  taxRatePercent: number;
  discountAmount?: number;
  currencySymbol?: string;
  amountPaid?: number;
  notes?: string;
}

export const INVOICE_PAGE = {
  width: 595.2,
  height: 841.92,
  marginX: 36,
  contentTop: 112,
  contentBottom: 158,
};

const BLACK = rgb(0.08, 0.08, 0.08);
const MUTED = rgb(0.28, 0.28, 0.28);
const HAIRLINE = rgb(0.82, 0.82, 0.82);
const BODY = 9.5;
const LABEL = 9;

function pdfText(value: string) {
  return value
    .replace(/\u20B5/g, "GH\u00A2")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\u0000-\u00FF]/g, "");
}

function money(amount: number, symbol?: string) {
  const prefix = !symbol || /[^\u0000-\u00FF]/.test(symbol) ? "GH\u00A2" : symbol;
  const sign = amount < 0 ? "-" : "";
  const [whole, fraction] = Math.abs(amount).toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${prefix} ${grouped}.${fraction}`;
}

function qtyLabel(qty: number) {
  if (Number.isInteger(qty)) return String(qty);
  return String(Math.round(qty * 100) / 100);
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const clean = pdfText(text).trim();
  if (!clean) return [""];
  const words = clean.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  return lines.slice(0, 8);
}

export async function stampInvoiceTemplate(
  template: Uint8Array,
  data: InvoiceTemplateInput,
) {
  const source = await PDFDocument.load(template);
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);

  let page = (await document.copyPages(source, [0]))[0];
  document.addPage(page);
  let y = page.getHeight() - INVOICE_PAGE.contentTop;
  let repeatingHeader = false;

  const right = () => page.getWidth() - INVOICE_PAGE.marginX;
  const left = INVOICE_PAGE.marginX;

  const newPage = async () => {
    page = (await document.copyPages(source, [0]))[0];
    document.addPage(page);
    y = page.getHeight() - INVOICE_PAGE.contentTop;
    if (repeatingHeader) drawTableHeader();
  };

  const ensure = async (height: number) => {
    if (y - height < INVOICE_PAGE.contentBottom) await newPage();
  };

  const drawTableHeader = () => {
    const size = LABEL;
    page.drawText("DESCRIPTION", { x: left, y, size, font: bold, color: BLACK });
    page.drawText("RATE", { x: left + 318, y, size, font: bold, color: BLACK });
    page.drawText("QTY", { x: left + 392, y, size, font: bold, color: BLACK });
    const total = "TOTAL";
    page.drawText(total, {
      x: right() - bold.widthOfTextAtSize(total, size),
      y,
      size,
      font: bold,
      color: BLACK,
    });
    y -= 6;
    page.drawLine({
      start: { x: left, y },
      end: { x: right(), y },
      thickness: 1.2,
      color: BLACK,
    });
    y -= 16;
  };

  const drawWrapped = (
    lines: string[],
    x: number,
    size: number,
    used: PDFFont,
    color = BLACK,
  ) => {
    for (const line of lines) {
      page.drawText(line, { x, y, size, font: used, color });
      y -= 12;
    }
  };

  const clientLines = [
    ...wrap(data.clientName || "Client", bold, 10, 270),
    ...(data.clientCompany ? wrap(data.clientCompany, font, BODY, 270) : []),
    ...(data.clientAddress ?? "")
      .split(/\n/)
      .flatMap((part) => (part.trim() ? wrap(part, font, BODY, 270) : [])),
  ];
  const meta = [
    ["INVOICE NO:", data.invoiceNo || "Draft", true],
    ["DATE:", data.date || "-", false],
    ["DUE DATE:", data.dueDate || "-", false],
  ] as const;
  const blockHeight = Math.max(16 + clientLines.length * 12, 16 + meta.length * 14) + 8;
  await ensure(blockHeight);

  const columnTop = y;
  page.drawText("ISSUED TO:", { x: left, y, size: LABEL, font: bold, color: BLACK });
  y -= 15;
  clientLines.forEach((line, index) => {
    page.drawText(line, {
      x: left,
      y,
      size: index === 0 ? 10 : BODY,
      font: index === 0 ? bold : font,
      color: index === 0 ? BLACK : MUTED,
    });
    y -= 12;
  });

  let metaY = columnTop;
  for (const [label, value, emphasize] of meta) {
    const valueFont = emphasize ? bold : font;
    const labelWidth = bold.widthOfTextAtSize(label, LABEL);
    const valueWidth = valueFont.widthOfTextAtSize(pdfText(value), LABEL);
    const x = right() - labelWidth - 8 - valueWidth;
    page.drawText(label, { x, y: metaY, size: LABEL, font: bold, color: BLACK });
    page.drawText(pdfText(value), {
      x: x + labelWidth + 8,
      y: metaY,
      size: LABEL,
      font: valueFont,
      color: BLACK,
    });
    metaY -= 14;
  }

  y = Math.min(y, metaY) - 18;
  repeatingHeader = true;
  await ensure(36);
  drawTableHeader();

  const items = data.items.length ? data.items : [{ description: "No line items yet", rate: 0, qty: 0 }];
  for (const item of items) {
    const description = wrap(item.description || "Line item", font, BODY, 300);
    const extras = (item.subLines ?? [])
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 6)
      .flatMap((line) => wrap(`- ${line}`, font, 8, 290));
    const rowLines = description.length + extras.length;
    const rowHeight = Math.max(16, rowLines * 11 + 8);
    await ensure(rowHeight);
    const rowTop = y;
    description.forEach((line, index) => {
      page.drawText(line, { x: left, y: rowTop - index * 11, size: BODY, font, color: BLACK });
    });
    extras.forEach((line, index) => {
      page.drawText(line, {
        x: left + 8,
        y: rowTop - description.length * 11 - index * 11,
        size: 8,
        font,
        color: MUTED,
      });
    });
    page.drawText(money(item.rate, data.currencySymbol), {
      x: left + 318,
      y: rowTop,
      size: BODY,
      font,
      color: MUTED,
    });
    page.drawText(qtyLabel(item.qty), {
      x: left + 392,
      y: rowTop,
      size: BODY,
      font,
      color: MUTED,
    });
    const totalLabel = money(item.rate * item.qty, data.currencySymbol);
    page.drawText(totalLabel, {
      x: right() - font.widthOfTextAtSize(totalLabel, BODY),
      y: rowTop,
      size: BODY,
      font,
      color: BLACK,
    });
    y = rowTop - rowHeight + 4;
    page.drawLine({
      start: { x: left, y },
      end: { x: right(), y },
      thickness: 0.4,
      color: HAIRLINE,
    });
    y -= 14;
  }

  const subtotal = data.items.reduce((sum, item) => sum + item.rate * item.qty, 0);
  const tax = subtotal * ((data.taxRatePercent ?? 0) / 100);
  const discount = data.discountAmount ?? 0;
  const total = Math.max(subtotal + tax - discount, 0);
  const paid = data.amountPaid ?? 0;
  const totals: Array<[string, string, boolean]> = [["SUBTOTAL", money(subtotal, data.currencySymbol), false]];
  if (discount > 0) totals.push(["DISCOUNT", `- ${money(discount, data.currencySymbol)}`, false]);
  if ((data.taxRatePercent ?? 0) > 0) {
    totals.push([`TAX ${data.taxRatePercent}%`, money(tax, data.currencySymbol), false]);
  }
  totals.push(["TOTAL", money(total, data.currencySymbol), true]);
  if (paid > 0) {
    totals.push(["AMOUNT PAID", money(paid, data.currencySymbol), false]);
    totals.push(["BALANCE DUE", money(Math.max(total - paid, 0), data.currencySymbol), true]);
  }

  repeatingHeader = false;
  await ensure(totals.length * 14 + 12);
  y -= 4;
  for (const [label, value, emphasize] of totals) {
    if (label === "TOTAL") {
      y -= 8;
      page.drawLine({
        start: { x: right() - 176, y },
        end: { x: right(), y },
        thickness: 1.1,
        color: BLACK,
      });
      y -= 14;
    }
    const used = emphasize ? bold : font;
    page.drawText(label, {
      x: right() - 168,
      y,
      size: LABEL,
      font: used,
      color: BLACK,
    });
    page.drawText(value, {
      x: right() - used.widthOfTextAtSize(value, LABEL),
      y,
      size: LABEL,
      font: used,
      color: BLACK,
    });
    y -= 14;
  }

  const note = (data.notes ?? "").trim();
  if (note) {
    const noteLines = wrap(note, font, 8, right() - left);
    await ensure(18 + noteLines.length * 11);
    y -= 8;
    page.drawText("NOTES", { x: left, y, size: LABEL, font: bold, color: BLACK });
    y -= 13;
    drawWrapped(noteLines, left, 8, font, MUTED);
  }

  return document.save();
}
