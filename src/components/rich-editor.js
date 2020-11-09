import React, { useCallback, useRef, useState } from "react";
import Editor from 'draft-js-plugins-editor';
import { EditorState } from 'draft-js';
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import createLinkPlugin from 'draft-js-anchor-plugin';

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
} from 'draft-js-buttons';

import 'draft-js/dist/Draft.css';
// import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import "./rich-editor.pure.scss";

const linkPlugin = createLinkPlugin();
const staticToolbarPlugin = createToolbarPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();

const PLUGINS = [staticToolbarPlugin, inlineToolbarPlugin, linkPlugin];

const { Toolbar } = staticToolbarPlugin;
const { InlineToolbar } = inlineToolbarPlugin;

function RichEditor() {

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const editor = useRef(null);

  const onFocus = useCallback(() => {
    if (editor.current) {
      editor.current.focus();
    }
  }, []);

  return <div className={"editor"} onClick={onFocus}>
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      plugins={PLUGINS}
      ref={editor}
    />
    {/* <InlineToolbar>
      {
        // may be use React.Fragment instead of div to improve perfomance after React 16
        (externalProps) => (
          <>
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <Separator {...externalProps} />
            <linkPlugin.LinkButton {...externalProps} />
          </>
        )
      }
    </InlineToolbar> */}
    <Toolbar>
      {
        // may be use React.Fragment instead of div to improve perfomance after React 16
        (externalProps) => (
          <>
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <Separator {...externalProps} />
            <HeadlineOneButton {...externalProps} />
            <HeadlineTwoButton {...externalProps} />
            <HeadlineThreeButton {...externalProps} />
            <UnorderedListButton {...externalProps} />
            <OrderedListButton {...externalProps} />
            <BlockquoteButton {...externalProps} />
            <linkPlugin.LinkButton {...externalProps} />
          </>
        )
      }
    </Toolbar>
  </div>;
}

export default RichEditor;