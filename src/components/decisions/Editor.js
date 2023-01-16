import React, { useState  } from 'react';
// import CodeEditor from 'react-simple-code-editor';
// import MonacoEditor from '@uiw/react-monacoeditor';


import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
// import { highlight, languages } from    'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/themes/prism.css'; //Example style, you can use another

import "./index.css";
function Editor(props) {
   

  const [code, setCode] = useState(
    props.code
    // `function add(a, b) {\n  return a + b;\n}`
  );
  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: false,
    theme: 'vs-dark',
    scrollbar: {
      // Subtle shadows to the left & top. Defaults to true.
      useShadows: false,
      // Render vertical arrows. Defaults to false.
      verticalHasArrows: true,
      // Render horizontal arrows. Defaults to false.
      horizontalHasArrows: true,
      // Render vertical scrollbar.
      // Accepted values: 'auto', 'visible', 'hidden'.
      // Defaults to 'auto'
      vertical: 'visible',
      // Render horizontal scrollbar.
      // Accepted values: 'auto', 'visible', 'hidden'.
      // Defaults to 'auto'
      horizontal: 'visible',
      verticalScrollbarSize: 17,
      horizontalScrollbarSize: 17,
      arrowSize: 30,
    },
  };
  return (
    <MonacoEditor
      height="500px"
      language="javascript"
      editorDidMount={this.editorDidMount.bind(this)}
      onChange={this.onChange.bind(this)}
      value={code}
      options={options}
    />
  );
}
export default Editor;