"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from '@tiptap/extension-placeholder';
import MenuBar from './menu-bar';
import { Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';

export default function Tiptap({ content, setContent, placeholder, className }: {
  content: string | undefined,
  setContent: Dispatch<SetStateAction<string | undefined>>
  placeholder?: string | null;
} & React.ComponentProps<"div">) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3"
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3"
          }
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder: placeholder || ""
      })
    ],
    content,
    editorProps: {
      attributes: {
        class: cn([
          "w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-2 text-base md:text-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring transition-[color,box-shadow]",
          className
        ])
      }
    },
    onUpdate: ({ editor }) => {
      const text = editor.getHTML();
      setContent(text);
    }
  })

  return (
    <div className="w-full rounded-md border bg-transparent p-2">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
