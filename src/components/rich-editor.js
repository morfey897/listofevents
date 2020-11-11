import React, { useCallback, useMemo, useRef, useState } from "react";
import Editor from 'draft-js-plugins-editor';
import { EditorState } from 'draft-js';
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
// import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
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

// import './rich-editor.pure.scss';
// import './rich-editor.button.pure.scss';
// import './rich-editor.toolbar.pure.scss';
import { makeStyles } from "@material-ui/core";

// const linkPlugin = createLinkPlugin();

// const staticToolbarPlugin = createToolbarPlugin({
//   theme: { 
//     buttonStyles: {
//       buttonWrapper: "buttonWrapper",
//       button: "button",
//       active: "active"
//     }, 
//     toolbarStyles: {
//       toolbar: "toolbar"
//     } }
// });

// const inlineToolbarPlugin = createInlineToolbarPlugin();

// const PLUGINS = [staticToolbarPlugin, linkPlugin];

// const { Toolbar } = staticToolbarPlugin;

const useStyles = makeStyles((theme) => ({
  editor: {
    cursor: "text",
    padding: theme.spacing(2),
    borderRadius: "2px",
    boxShadow: theme.shadows[2],// "inset 0px 1px 8px -3px #ABABAB",
    background: theme.palette.background.default,

    "& .public-DraftEditor-content": {
      minHeight: theme.spacing(15),
    }
  },

  toolbar: {
    background: theme.palette.background.paper,
    borderRadius: "4px",
    boxShadow: theme.shadows[2],
    zIndex: 2,
  },

  buttonWrapper: {
    display: "inline-block"
  },
  
  button: {
    background: theme.palette.info.main,
    color: theme.palette.info.contrastText,
    fontSize: "18px",
    border: 0,
    paddingTop: "5px",
    verticalAlign: "bottom",
    height: "34px",
    width: "36px",
    borderRadius: "4px",

    "& svg": {
      fill: theme.palette.info.contrastText
    },

    "&:hover": {
      background: theme.palette.info.dark
    }, 
    "&:focus": {
      background: theme.palette.info.dark
    }
  },

  active: {
    background: theme.palette.info.dark,
    color: theme.palette.info.contrastText,

    "& svg": {
      fill: theme.palette.info.contrastText,
    }
  }

}));

function RichEditor() {

  const classes = useStyles();

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const editor = useRef(null);

  const onFocus = useCallback(() => {
    if (editor.current) {
      editor.current.focus();
    }
  }, []);

  const plugins = useMemo(() => ({
    linkPlugin: createLinkPlugin(),
    staticToolbarPlugin: createToolbarPlugin({
      theme: {
        toolbarStyles: { toolbar: classes.toolbar },
        buttonStyles: { buttonWrapper: classes.buttonWrapper, button: classes.button, active: classes.active }
      }
    })
  }
  ), []);

  return <div className={classes.editor} onClick={onFocus}>
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      plugins={Object.values(plugins)}
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
    <plugins.staticToolbarPlugin.Toolbar>
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
            <plugins.linkPlugin.LinkButton {...externalProps} />
          </>
        )
      }
    </plugins.staticToolbarPlugin.Toolbar>
  </div>;
}

export default RichEditor;