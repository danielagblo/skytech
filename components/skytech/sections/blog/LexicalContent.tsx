interface LexicalNode {
  type: string;
  tag?: string;
  text?: string;
  format?: number;
  url?: string;
  children?: LexicalNode[];
  [key: string]: unknown;
}

function renderNode(node: LexicalNode | null, index: number): React.ReactNode {
  if (!node) return null;

  const key = `${node.type}-${index}`;

  switch (node.type) {
    case "root":
      return <div key={key} className="space-y-6">{node.children?.map(renderNode)}</div>;
    case "paragraph":
      return (
        <p key={key} className="text-gray-700 leading-relaxed">
          {node.children?.map(renderNode)}
        </p>
      );
    case "text": {
      let text: React.ReactNode = node.text;
      if (node.format && (node.format & 1) === 1) text = <strong key={`${key}-bold`}>{text}</strong>;
      if (node.format && (node.format & 2) === 2) text = <em key={`${key}-italic`}>{text}</em>;
      return <span key={key}>{text}</span>;
    }
    case "heading": {
      const Tag = (node.tag || "h2") as "h1" | "h2" | "h3" | "h4";
      return (
        <Tag key={key} className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-10 mb-4">
          {node.children?.map(renderNode)}
        </Tag>
      );
    }
    case "list": {
      const ListTag = node.tag === "ol" ? "ol" : "ul";
      return (
        <ListTag key={key} className={`ml-6 mb-6 space-y-3 ${node.tag === "ol" ? "list-decimal" : "list-disc"}`}>
          {node.children?.map(renderNode)}
        </ListTag>
      );
    }
    case "listitem":
      return <li key={key} className="text-slate-700 leading-relaxed">{node.children?.map(renderNode)}</li>;
    case "link":
      return (
        <a
          key={key}
          href={node.url}
          className="text-[#2f59c1] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {node.children?.map(renderNode)}
        </a>
      );
    default:
      return null;
  }
}

export default function LexicalContent({ content }: { content: string }) {
  try {
    const state = JSON.parse(content);
    return <>{renderNode(state.root, 0)}</>;
  } catch (e) {
    return <p className="text-red-500">Error rendering content.</p>;
  }
}
