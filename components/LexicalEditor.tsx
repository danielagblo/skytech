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
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode } from '@lexical/code';

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

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  FORMAT_TEXT_COMMAND, 
  $getSelection, 
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL
} from 'lexical';
import { 
  INSERT_UNORDERED_LIST_COMMAND, 
  INSERT_ORDERED_LIST_COMMAND 
} from '@lexical/list';
import { useCallback, useEffect, useState } from 'react';

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  return (
    <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`p-2 rounded-lg transition-all ${isBold ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-200 text-slate-600'}`}
        title="Bold"
      >
        <b className="w-4 h-4 flex items-center justify-center">B</b>
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`p-2 rounded-lg transition-all ${isItalic ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-200 text-slate-600'}`}
        title="Italic"
      >
        <i className="w-4 h-4 flex items-center justify-center">I</i>
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`p-2 rounded-lg transition-all ${isUnderline ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-200 text-slate-600'}`}
        title="Underline"
      >
        <u className="w-4 h-4 flex items-center justify-center">U</u>
      </button>
      <div className="w-px h-6 bg-slate-200 mx-1" />
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-all"
        title="Bullet List"
      >
        <span className="text-lg leading-none">•</span>
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-all"
        title="Numbered List"
      >
        <span className="text-sm font-bold leading-none">1.</span>
      </button>
    </div>
  );
}

export default function LexicalEditor({ initialConfig = {}, onChange, value }: { initialConfig?: any, onChange: (json: string) => void, value?: string }) {
  const config = {
    namespace: 'BlogEditor',
    theme,
    onError,
    nodes: [
      ListNode,
      ListItemNode,
      LinkNode,
      HeadingNode,
      QuoteNode,
      CodeNode,
    ],
    ...initialConfig,
    editorState: value || undefined,
  };

  return (
    <div className="relative border border-slate-200 rounded-[2rem] bg-white overflow-hidden focus-within:border-blue-400 transition-all shadow-sm">
      <LexicalComposer initialConfig={config}>
        <div className="editor-container relative">
          <ToolbarPlugin />
          <RichTextPlugin
            contentEditable={<ContentEditable className="min-h-[400px] p-8 outline-none prose prose-slate max-w-none" />}
            placeholder={<div className="absolute top-[88px] left-8 text-slate-300 pointer-events-none italic">Start writing your masterpiece...</div>}
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
