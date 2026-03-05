import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  content: string;
  filename: string;
  onChange: (value: string | undefined) => void;
  onSave: () => void;
}

const getLanguage = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': return 'javascript';
    case 'ts': return 'typescript';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'json': return 'json';
    case 'py': return 'python';
    case 'cpp': return 'cpp';
    case 'c': return 'c';
    case 'java': return 'java';
    case 'cs': return 'csharp';
    case 'go': return 'go';
    case 'rb': return 'ruby';
    case 'php': return 'php';
    case 'xml': return 'xml';
    case 'md': return 'markdown';
    case 'sql': return 'sql';
    case 'sh':
    case 'bash': return 'shell';
    default: return 'plaintext';
  }
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ content, filename, onChange, onSave }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs font-mono text-white/50">{filename}</span>
        <button 
          onClick={onSave}
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Save Changes
        </button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguage(filename)}
          value={content}
          theme="vs-dark"
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            backgroundColor: 'transparent'
          }}
        />
      </div>
    </div>
  );
};
