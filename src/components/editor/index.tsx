import ExampleTheme from './themes';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';

import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import prepopulatedText from './sampleText.js';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

function Placeholder() {
  return (
    <div className="editor-placeholder">
      Play around with the Markdown plugin...
    </div>
  );
}

const editorConfig = {
  namespace: 'editor',
  editorState: prepopulatedText,
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error: any) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HorizontalRuleNode,
    HeadingNode,
    ListNode,
    TableNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="shadow-sm focus:ring-brand-500 focus:border-brand-500 block w-full sm:text-sm border border-slate-300 rounded-md mt-1">
        <ToolbarPlugin />
        <div>
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="prose prose-sm max-w-none p-4 prose-h1:text-2xl prose-slate dark:prose-dark outline-none" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <CodeHighlightPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
