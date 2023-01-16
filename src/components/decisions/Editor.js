import React, { useState  } from 'react';


import Editor  from "@monaco-editor/react";


// import "./index.css";
function EditorSourceCode(props) {
   const c = props.code+'';

  const [code, setCode] = useState(
    c
    // `function add(a, b) {\n  return a + b;\n}`
  );

  return (
    <Editor
    height="200px"
    fontSize="20px"
    style={{'font-size':'14px'}}
    defaultLanguage="javascript"
    value={code}
    defaultValue="Hello"
  />
  );
}
export default EditorSourceCode;