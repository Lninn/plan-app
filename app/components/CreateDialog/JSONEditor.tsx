import React, { useEffect, useRef } from 'react';
import type { JSONEditorPropsOptional } from 'vanilla-jsoneditor';
import { JSONEditor, Mode } from 'vanilla-jsoneditor';
import './JSONEditor.css'


const Editor: React.FC<JSONEditorPropsOptional> = (props) => {
  const editorRef = useRef<JSONEditor | null>(null);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) {
      return
    }

    editorRef.current = new JSONEditor({
      target: container.current,
      props: { mode: Mode.text },
    });
    return () => {
      editorRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    editorRef.current?.updateProps(props);
  }, [props.content]);

  return <div ref={container} className="vanilla-jsoneditor-react" />;
};

export default Editor;
