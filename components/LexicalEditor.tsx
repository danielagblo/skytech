'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'mb-4 text-slate-700 leading-relaxed',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    code: 'bg-slate-100 px-1 py-0.5 rounded text-sm font-mono',
  },
  list: {
    ul: 'list-disc ml-6 mb-4',
    ol: 'list-decimal ml-6 mb-4',
  },
  link: 'text-blue-600 hover:underline',
};

function onError(error: Error) {
  console.error(error);
}

export default function LexicalEditor({ initialConfig = {}, onChange, value }: { initialConfig?: any, onChange: (json: string) => void, value?: string }) {
  const config = {
    namespace: 'BlogEditor',
    theme,
    onError,
    ...initialConfig,
    editorState: value || undefined,
  };

  return (
    <div className="relative border border-slate-200 rounded-xl bg-white overflow-hidden focus-within:border-blue-400 transition-colors">
      <LexicalComposer initialConfig={config}>
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable className="min-h-[400px] p-6 outline-none" />}
            placeholder={<div className="absolute top-6 left-6 text-slate-400 pointer-events-none">Start writing your masterpiece...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={(editorState) => {
            onChange(JSON.stringify(editorState.toJSON()));
          }} />
        </div>
      </LexicalComposer>
    </div>
  );
}
