export interface HomeStatement {
  id: string;
  lead: string;
  mark: string;
  rest: string;
}

export interface HomeStatementsContent {
  statements: HomeStatement[];
}

export const DEFAULT_HOME_STATEMENTS: HomeStatementsContent = {
  statements: [
    {
      id: "stay",
      lead: "Even after launch, the work stays with",
      mark: "Skytech Ghana",
      rest: "in Accra.",
    },
    {
      id: "websites",
      lead: "Introducing",
      mark: "websites",
      rest: "that stay useful",
    },
    {
      id: "apps",
      lead: "Introducing",
      mark: "apps",
      rest: "your customers finish",
    },
    {
      id: "seo",
      lead: "Introducing",
      mark: "SEO",
      rest: "that keeps working",
    },
    {
      id: "tours",
      lead: "Introducing",
      mark: "virtual tours",
      rest: "you can walk",
    },
    {
      id: "crm",
      lead: "Introducing",
      mark: "a CRM",
      rest: "that keeps the client",
    },
  ],
};

export function normalizeHomeStatementsContent(
  input?: Partial<HomeStatementsContent> | null,
): HomeStatementsContent {
  const rows = Array.isArray(input?.statements) ? input.statements : [];
  const statements = rows
    .map((row, index) => {
      const lead = String(row?.lead || "").trim();
      const mark = String(row?.mark || "").trim();
      const rest = String(row?.rest || "").trim();
      if (!lead && !mark && !rest) return null;
      return {
        id: String(row?.id || `statement-${index + 1}`).trim() || `statement-${index + 1}`,
        lead,
        mark,
        rest,
      };
    })
    .filter(Boolean) as HomeStatement[];

  return {
    statements: statements.length ? statements : DEFAULT_HOME_STATEMENTS.statements,
  };
}
