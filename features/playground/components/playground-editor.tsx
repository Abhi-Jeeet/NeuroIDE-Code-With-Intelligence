"use client";
import React, { useEffect, useRef } from 'react'
import Editor, {type Monaco} from "@monaco-editor/react"
import { TemplateFile } from '../lib/path-to-json';

import { configureMonaco, defaultEditorOptions, getEditorLanguage } from '../lib/editor-config';
import { Value } from '@radix-ui/react-select';

interface PlaygroundEditorProps{
    activeFile:TemplateFile | undefined
    content:string
    onContentChange:(value:string)=> void

}

const PlaygroundEditor = ({
    activeFile,
    content,
    onContentChange,
}: PlaygroundEditorProps) => {
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<Monaco | null>(null);

    const handleEditorDidMount = (editor:any, monaco:Monaco)=>{
        editorRef.current = editor;
        monacoRef.current = monaco;
        configureMonaco(monaco)
        updateEditorLanguage();
    }

    const updateEditorLanguage = () => {
    if (!activeFile || !monacoRef.current || !editorRef.current) return
    const model = editorRef.current.getModel()
    if (!model) return

    const language = getEditorLanguage(activeFile.fileExtension || "")
    try {
      monacoRef.current.editor.setModelLanguage(model, language)
    } catch (error) {
      console.warn("Failed to set editor language:", error)
    }
  }
   useEffect(() => {
    updateEditorLanguage()
  }, [activeFile])

  return <div className='h-full relative'>

  <Editor
  height={"100%"}
  value={content}
  onChange={(Value)=>onContentChange(Value || "")}
  onMount={handleEditorDidMount}
  language={activeFile ? getEditorLanguage(activeFile.fileExtension || ""): "plaintext"}
//@ts-ignore
  options={defaultEditorOptions}
  />

  </div>
}

export default PlaygroundEditor