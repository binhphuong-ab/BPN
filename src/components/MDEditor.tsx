'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Dynamic import to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

const Markdown = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

interface MDEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  preview?: 'live' | 'edit' | 'preview';
  hideToolbar?: boolean;
  placeholder?: string;
}



export default function CustomMDEditor({
  value,
  onChange,
  height = 500,
  preview = 'live',
  hideToolbar = false,
  placeholder = 'Enter markdown here...',
}: MDEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="border border-gray-300 rounded-md p-4 bg-gray-50"
        style={{ height }}
      >
        <div className="animate-pulse">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="w-full" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(newValue) => onChange(newValue || '')}
        height={height}
        preview={preview}
        hideToolbar={hideToolbar}
        textareaProps={{
          placeholder,
          style: { fontSize: 14, lineHeight: 1.5 }
        }}
        data-color-mode="light"
        previewOptions={{
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        }}
      />
    </div>
  );
}

// Separate markdown preview component for displaying blog posts
interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`animate-pulse bg-gray-100 rounded p-4 ${className}`}>
        Loading preview...
      </div>
    );
  }

  return (
    <div className={`prose prose-lg max-w-none ${className}`} data-color-mode="light">
      <Markdown
        source={content}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      />
    </div>
  );
}
