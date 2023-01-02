import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  $getNodeByKey,
  $getRoot,
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $wrapNodes, $isAtNodeEnd } from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { createPortal } from 'react-dom';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages,
} from '@lexical/code';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Icon } from '@iconify/react';
import textHeader124Regular from '@iconify/icons-fluent/text-header-1-24-regular';
import textHeader224Regular from '@iconify/icons-fluent/text-header-2-24-regular';
import textHeader324Regular from '@iconify/icons-fluent/text-header-3-24-regular';
import textNumberListLtr24Regular from '@iconify/icons-fluent/text-number-list-ltr-24-regular';
import textBulletListLtr24Regular from '@iconify/icons-fluent/text-bullet-list-ltr-24-regular';
import code24Regular from '@iconify/icons-fluent/code-24-regular';
import textQuote24Regular from '@iconify/icons-fluent/text-quote-24-regular';
import textBold24Regular from '@iconify/icons-fluent/text-bold-24-regular';
import textItalic24Regular from '@iconify/icons-fluent/text-italic-24-regular';
import textUnderline24Regular from '@iconify/icons-fluent/text-underline-24-regular';
import textT24Regular from '@iconify/icons-fluent/text-t-24-regular';
import textStrikethrough24Regular from '@iconify/icons-fluent/text-strikethrough-24-regular';
import link24Regular from '@iconify/icons-fluent/link-24-regular';
import markdown20Filled from '@iconify/icons-fluent/markdown-20-filled';
import previewLink24Regular from '@iconify/icons-fluent/preview-link-24-regular';
import { classNames } from '~/lib/classnames';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown';
import { PLAYGROUND_TRANSFORMERS } from './MarkdownTransformers';

const LowPriority = 1;

const supportedBlockTypes = new Set([
  'paragraph',
  'quote',
  'code',
  'h1',
  'h2',
  'ul',
  'ol',
]);

function Divider() {
  return <div className="border-l mr-2 ml-2" />;
}

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = '0';
    editor.style.top = '-1000px';
    editor.style.left = '-1000px';
  } else {
    editor.style.opacity = '1';
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== 'link-input') {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl('');
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority,
      ),
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== '') {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className="link-edit"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

function Select({ onChange, className, options, value }) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

const blockTypes = [
  {
    name: 'Normal',
    shortName: 'Normal',
    type: 'paragraph',
    icon: textT24Regular,
  },
  {
    name: 'Large Heading',
    shortName: 'Large',
    type: 'h1',
    icon: textHeader124Regular,
  },
  {
    name: 'Small Heading',
    shortName: 'Small',
    type: 'h2',
    icon: textHeader224Regular,
  },
  {
    name: 'Bulleted List',
    shortName: 'Bulleted',
    type: 'ul',
    icon: textBulletListLtr24Regular,
  },
  {
    name: 'Numbered List',
    shortName: 'Numbered',
    type: 'ol',
    icon: textNumberListLtr24Regular,
  },
  {
    name: 'Quote',
    shortName: 'Quote',
    type: 'quote',
    icon: textQuote24Regular,
  },
  {
    name: 'Code Block',
    shortName: 'Code',
    type: 'code',
    icon: code24Regular,
  },
];

const BlockOptionsDropdownList = ({
  selected,
  setSelected,
  editor,
  blockType,
}) => {
  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatLargeHeading = () => {
    if (blockType !== 'h1') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h1'));
        }
      });
    }
  };

  const formatSmallHeading = () => {
    if (blockType !== 'h2') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h2'));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
  };

  return (
    <div className="w-48">
      <Listbox
        value={selected}
        onChange={(e) => {
          switch (e.type) {
            case 'paragraph':
              formatParagraph();
              break;
            case 'h1':
              formatLargeHeading();
              break;
            case 'h2':
              formatSmallHeading();
              break;
            case 'ul':
              formatBulletList();
              break;
            case 'ol':
              formatNumberedList();
              break;
            case 'quote':
              formatQuote();
              break;
            case 'code':
              formatCode();
              break;

            default:
              console.log('Check available block types.');
              break;
          }
          setSelected(e);
        }}
      >
        <div className="relative mt-1 z-10">
          <Listbox.Button className="relative w-full flex cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-300 sm:text-sm">
            <span className="inset-y-0 right-0 flex items-center pr-2">
              <Icon icon={selected?.icon} className="h-5 w-5 text-gray-500" />
            </span>
            <span className="block truncate">{selected?.shortName}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Listbox.Options className="absolute mt-1 max-h-72 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {blockTypes.map((blockType, blockTypeIdx) => (
                <Listbox.Option
                  key={blockTypeIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-brand-100 text-brand-900' : 'text-gray-900'
                    }`
                  }
                  value={blockType}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {blockType.name}
                      </span>
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
                        <Icon icon={blockType.icon} className="h-5 w-5" />
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

const MarkdownTabPlugin = ({ editor }) => {
  const [isMarkdown, setIsMarkdown] = useState(false);

  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if ($isCodeNode(firstChild) && firstChild?.getLanguage() === 'markdown') {
        $convertFromMarkdownString(
          firstChild.getTextContent(),
          PLAYGROUND_TRANSFORMERS,
        );
        setIsMarkdown(false);
      } else {
        const markdown = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS);
        root
          .clear()
          .append(
            $createCodeNode('markdown').append($createTextNode(markdown)),
          );
        setIsMarkdown(true);
      }
      root.selectEnd();
    });
  }, [editor]);

  return (
    <div className="hidden lg:flex items-center ml-6 rounded-md ring-1 ring-gray-900/5 shadow-sm dark:ring-0 dark:bg-gray-800 dark:shadow-highlight/4">
      <button
        type="button"
        className="group p-2 focus:outline-none focus-visible:ring-2 rounded-md focus-visible:ring-gray-400/70 dark:focus-visible:ring-gray-500"
        onClick={handleMarkdownToggle}
      >
        <Icon
          icon={isMarkdown ? previewLink24Regular : markdown20Filled}
          className="h-5 w-5 text-gray-600"
        />
      </button>
    </div>
  );
};

export default function ToolbarPlugin() {
  const [selected, setSelected] = useState(blockTypes[0]);
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [blockType, setBlockType] = useState('paragraph');
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  // TODO: Clean this mess up
  useEffect(() => {
    const newBlockType = blockTypes.find((block) => block.type === blockType);
    if (typeof newBlockType === 'undefined') {
      setSelected(blockTypes[0]);
    } else {
      setSelected(newBlockType);
    }
  }, [blockType]);

  const codeLanguges = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    (e) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div
      className="flex items-center justify-between p-1 border-b"
      ref={toolbarRef}
    >
      <div className="flex">
        {supportedBlockTypes.has(blockType) && (
          <>
            <BlockOptionsDropdownList
              selected={selected}
              setSelected={setSelected}
              blockType={blockType}
              editor={editor}
            />
            <Divider />
          </>
        )}
        {blockType === 'code' ? (
          <Select
            className="block rounded-md border-gray-300 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50"
            onChange={onCodeLanguageSelect}
            options={codeLanguges}
            value={codeLanguage}
          />
        ) : (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
              }}
              className={classNames(
                'h-10 w-10 flex items-center justify-center',
                isBold && 'border rounded-lg shadow-sm hover:bg-gray-50',
              )}
              aria-label="Format Bold"
            >
              <Icon
                icon={textBold24Regular}
                className={classNames(
                  'h-5 w-5',
                  isBold ? 'text-gray-600' : 'text-gray-500',
                )}
              />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
              }}
              className={classNames(
                'h-10 w-10 flex items-center justify-center',
                isItalic && 'border rounded-lg shadow-sm hover:bg-gray-50',
              )}
              aria-label="Format Italics"
            >
              <Icon
                icon={textItalic24Regular}
                className={classNames(
                  'h-5 w-5',
                  isItalic ? 'text-gray-600' : 'text-gray-500',
                )}
              />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
              }}
              className={classNames(
                'h-10 w-10 flex items-center justify-center',
                isUnderline && 'border rounded-lg shadow-sm hover:bg-gray-50',
              )}
              aria-label="Format Underline"
            >
              <Icon
                icon={textUnderline24Regular}
                className={classNames(
                  'h-5 w-5',
                  isUnderline ? 'text-gray-600' : 'text-gray-500',
                )}
              />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
              }}
              className={classNames(
                'h-10 w-10 flex items-center justify-center',
                isStrikethrough &&
                  'border rounded-lg shadow-sm hover:bg-gray-50',
              )}
              aria-label="Format Strikethrough"
            >
              <Icon
                icon={textStrikethrough24Regular}
                className={classNames(
                  'h-5 w-5',
                  isStrikethrough ? 'text-gray-600' : 'text-gray-500',
                )}
              />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
              }}
              className={classNames(
                'h-10 w-10 flex items-center justify-center',
                isCode && 'border rounded-lg shadow-sm hover:bg-gray-50',
              )}
              aria-label="Insert Code"
            >
              <Icon
                icon={code24Regular}
                className={classNames(
                  'h-5 w-5',
                  isCode ? 'text-gray-600' : 'text-gray-500',
                )}
              />
            </button>
            <button
              onClick={insertLink}
              className={classNames(
                'h-10 w-10 flex items-center justify-center',
                isLink && 'border rounded-lg shadow-sm hover:bg-gray-50',
              )}
              aria-label="Insert Link"
            >
              <Icon
                icon={link24Regular}
                className={classNames(
                  'h-5 w-5',
                  isLink ? 'text-gray-600' : 'text-gray-500',
                )}
              />
            </button>
            {isLink &&
              createPortal(
                <FloatingLinkEditor editor={editor} />,
                document.body,
              )}
          </div>
        )}
      </div>
      <MarkdownTabPlugin editor={editor} />
    </div>
  );
}
