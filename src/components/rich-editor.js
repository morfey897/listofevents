import { useMemo, useState, useRef, useCallback } from "react";
import Editor from '@draft-js-plugins/editor';
import { EditorState } from 'draft-js';
import createToolbarPlugin, { Separator } from '@draft-js-plugins/static-toolbar';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createLinkPlugin from '@draft-js-plugins/anchor';
import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from 'draft-js-export-html';

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
} from '@draft-js-plugins/buttons';

import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';

import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  editor: {
    cursor: "text",
    padding: theme.spacing(2),
    borderRadius: "2px",
    boxShadow: theme.shadows[2],// "inset 0px 1px 8px -3px #ABABAB",
    background: theme.palette.background.level1,

    "& .public-DraftEditor-content": {
      minHeight: theme.spacing(15),
    }
  },

  toolbar: {
    background: theme.palette.background.level2,
    borderRadius: "4px",
    boxShadow: theme.shadows[2],
    zIndex: 2,
  },

  toolbarInline: {
    left: "50%",
    transform: "translate(-50%) scale(0)",
    position: "absolute",
    background: theme.palette.background.level2,
    borderRadius: "2px",
    boxShadow: theme.shadows[3],
    zIndex: theme.zIndex.tooltip,
  },

  buttonWrapper: {
    display: "inline-block"
  },

  button: {
    background: theme.palette.grey[theme.palette.type === "dark" ? "800" : "200"],
    color: theme.palette.text.primary,
    fontSize: "18px",
    border: 0,
    paddingTop: "5px",
    verticalAlign: "bottom",
    height: "34px",
    width: "36px",
    borderRadius: "4px",

    "& svg": {
      fill: theme.palette.text.primary
    },

    "&::hover": {
      background: theme.palette.grey[theme.palette.type === "dark" ? "900" : "300"]
    },
    "&::focus": {
      background: theme.palette.grey[theme.palette.type === "dark" ? "900" : "300"]
    }
  },

  active: {
    background: theme.palette.grey[theme.palette.type === "dark" ? "900" : "300"],
    color: theme.palette.text.primary,

    "& svg": {
      fill: theme.palette.text.primary,
    }
  },

  inputAnchor: {
    height: "34px",
    width: "220px",
    background: theme.palette.grey[theme.palette.type === "dark" ? "800" : "200"],
    color: theme.palette.text.primary,
    padding: "0 12px",
    border: "none",
    outline: "none",

    "&::placeholder": {
      color: theme.palette.text.disabled,
    }
  },

  inputAnchorInvalid: {
    color: theme.palette.error.main
  },

  anchor: {
    color: theme.palette.info.main,
    textDecoration: "underline"
  }

}));

function RichEditor({ children, content, onChange, ...props }) {

  const classes = useStyles();
  const theme = useTheme();
  const innerRef = useRef(null);

  const [editorState, setEditorState] = useState(content ? EditorState.createWithContent(stateFromHTML(content)) : EditorState.createEmpty());

  const plugins = useMemo(() => ({
    linkPlugin: createLinkPlugin({
      theme: {
        input: classes.inputAnchor,
        inputInvalid: classes.inputAnchorInvalid,
        link: classes.anchor,
      },
      placeholder: 'http://…'
    }),
    inlineToolbarPlugin: createInlineToolbarPlugin({
      theme: {
        toolbarStyles: { toolbar: classes.toolbarInline },
        buttonStyles: { buttonWrapper: classes.buttonWrapper, button: classes.button, active: classes.active }
      }
    }),
    staticToolbarPlugin: createToolbarPlugin({
      theme: {
        toolbarStyles: { toolbar: classes.toolbar },
        buttonStyles: { buttonWrapper: classes.buttonWrapper, button: classes.button, active: classes.active }
      }
    })
  }
  ), [classes]);

  const onBlur = useCallback((e) => {
    onChange(innerRef.current && stateToHTML(innerRef.current.getEditorState().getCurrentContent()) || "");
  }, []);

  return <div className={classes.editor} onBlur={onBlur}>
    <Editor
      key={`editor_${theme.palette.type}`}
      editorState={editorState}
      onChange={setEditorState}
      plugins={Object.values(plugins)}
      ref={innerRef}
      {...props}
    />
    <plugins.inlineToolbarPlugin.InlineToolbar key={`inline_toolbar_${theme.palette.type}`}>
      {
        // may be use React.Fragment instead of div to improve perfomance after React 16
        (externalProps) => (
          <>
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <Separator {...externalProps} />
            <plugins.linkPlugin.LinkButton {...externalProps} />
          </>
        )
      }
    </plugins.inlineToolbarPlugin.InlineToolbar>
    <plugins.staticToolbarPlugin.Toolbar key={`toolbar_${theme.palette.type}`}>
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