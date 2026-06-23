import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon, List, Heading1, Heading2, Bold, Italic, Folder, Youtube as YoutubeIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, Palette, Table as TableIcon } from "lucide-react";

export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [abstract, setAbstract] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [downloadFile, setDownloadFile] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Tell your story...",
      }),
      Image,
      Link,
      CharacterCount,
      Youtube.configure({
        inline: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-lg prose-brand max-w-none focus:outline-none min-h-[400px]",
      },
    },
  });

  useEffect(() => {
    if (id && id !== "new") {
      fetch(`/api/articles/${id}`)
        .then(r => r.json())
        .then(data => {
          setTitle(data.title || "");
          setSubtitle(data.subtitle || "");
          setFeaturedImage(data.featured_image || "");
          setCategoryId(data.category_id || "");
          setAbstract(data.abstract || "");
          setGithubRepo(data.github_repo || "");
          setDownloadFile(data.download_file || "");
          editor?.commands.setContent(data.content);
        });
    }
  }, [id, editor]);

  const handleSave = async (status: "draft" | "published") => {
    if (!editor) return;
    setSaving(true);
    const content = editor.getHTML();
    
    const payload = {
      title,
      subtitle,
      category_id: categoryId,
      featured_image: featuredImage,
      abstract,
      github_repo: githubRepo,
      download_file: downloadFile,
      content,
      status,
      // For SEO and meta
      seo_title: title,
      reading_time: Math.ceil((editor.storage.characterCount.words() || 0) / 200) + " min read",
    };

    try {
      const url = id && id !== "new" ? `/api/articles/${id}` : "/api/articles";
      const method = id && id !== "new" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setSaving(false);
      navigate("/admin/articles");
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toolbar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/articles")} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-gray-500">{saving ? "Saving..." : "Draft"}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => handleSave("draft")} className="text-gray-600 font-semibold text-sm hover:text-gray-900 transition-colors">
            Save Draft
          </button>
          <button onClick={() => handleSave("published")} className="bg-brand-500 text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-brand-600 transition-colors shadow-sm">
            Publish
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Settings Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
             <Folder className="h-4 w-4 text-gray-400" />
             <select 
               className="bg-transparent border-none text-sm font-medium text-gray-700 outline-none w-40"
               value={categoryId}
               onChange={e => setCategoryId(e.target.value)}
             >
               <option value="">Select Category</option>
               {categories.map(c => (
                 <option key={c.id} value={c.id}>{c.name}</option>
               ))}
             </select>
          </div>
        </div>

        {/* Title Area */}
        <div className="mb-8 relative">
          <input 
            type="text" 
            placeholder="Paper Title"
            className="w-full text-5xl font-bold text-gray-900 border-none outline-none bg-transparent placeholder:text-gray-300 mb-4 font-sans tracking-tight"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Subtitle or short description..."
            className="w-full text-xl text-gray-500 border-none outline-none bg-transparent placeholder:text-gray-300"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
          />
        </div>

        {/* Molo BTC Research Attributes */}
        <div className="mb-8 bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-4">
          <h4 className="text-xs font-bold text-gray-450 uppercase tracking-wider">Research Metadata Specs</h4>
          
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Abstract Summary</label>
            <textarea
              placeholder="Provide a beginner-friendly summary. The Molo AI Tutor uses this abstract as core grounding context."
              className="w-full text-xs text-gray-700 bg-white border border-gray-200 rounded-lg p-2.5 outline-none focus:border-brand-500 font-sans leading-relaxed min-h-[60px]"
              value={abstract}
              onChange={e => setAbstract(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Linked GitHub Repository Link</label>
              <input
                type="text"
                placeholder="https://github.com/molobtc/..."
                className="w-full text-xs text-gray-750 bg-white border border-gray-200 rounded-lg p-2.5 outline-none focus:border-brand-500 font-mono"
                value={githubRepo}
                onChange={e => setGithubRepo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">PDF Recap File Key</label>
              <input
                type="text"
                placeholder="e.g. scarcity_breakdown.pdf"
                className="w-full text-xs text-gray-750 bg-white border border-gray-200 rounded-lg p-2.5 outline-none focus:border-brand-500 font-mono"
                value={downloadFile}
                onChange={e => setDownloadFile(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Featured Image placeholder logic */}
        <div className={`mb-12 rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 border-dashed flex flex-col items-center justify-center transition-all ${featuredImage ? 'h-auto border-none' : 'h-64 hover:bg-gray-100 cursor-pointer'}`}>
           {featuredImage ? (
             <div className="relative group w-full aspect-[16/9]">
               <img src={featuredImage} alt="Cover" className="w-full h-full object-cover" />
               <button onClick={() => setFeaturedImage("")} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                 Clear
               </button>
             </div>
           ) : (
             <button onClick={() => setFeaturedImage("https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=2787&auto=format&fit=crop")} className="flex flex-col items-center text-gray-400 hover:text-gray-600">
               <ImageIcon className="h-8 w-8 mb-2" />
               <span className="text-sm font-medium">Add Cover Image</span>
             </button>
           )}
        </div>

        {/* Sticky formatting bar */}
        {editor && (
          <div className="sticky top-[73px] z-10 w-full mb-8 flex flex-wrap items-center gap-1 bg-white border border-gray-200 rounded-xl p-2 shadow-sm mx-auto justify-center">
            
            {/* Fonts */}
            <select 
              className="text-sm bg-gray-50 border border-gray-200 rounded p-1 outline-none mr-2 font-medium"
              onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            >
              <option value="">Default Font</option>
              <option value="Inter">Inter</option>
              <option value="Comic Sans MS, Comic Sans">Comic Sans</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
            </select>

            {/* Colors */}
            <input
              type="color"
              onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
              value={editor.getAttributes('textStyle').color || '#000000'}
              className="w-6 h-6 p-0 border-0 rounded cursor-pointer mr-2 bg-transparent"
              title="Text Color"
            />
            
            <div className="w-px h-6 bg-gray-200 mx-1" />

            <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100 text-brand-600' : 'text-gray-700'}`}>
              <Bold className="h-4 w-4" />
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100 text-brand-600' : 'text-gray-700'}`}>
              <Italic className="h-4 w-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-200 mx-1" />
            
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100 text-brand-600' : 'text-gray-700'}`}>
              <Heading2 className="h-4 w-4" />
            </button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-100 text-brand-600' : 'text-gray-700'}`}>
              <List className="h-4 w-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-200 mx-1" />

            <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100 text-brand-600' : 'text-gray-700'}`}>
              <AlignLeft className="h-4 w-4" />
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100 text-brand-600' : 'text-gray-700'}`}>
              <AlignCenter className="h-4 w-4" />
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100 text-brand-600' : 'text-gray-700'}`}>
              <AlignRight className="h-4 w-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <button onClick={() => {
              const url = window.prompt("URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }} className="p-2 rounded hover:bg-gray-100 text-gray-700">
              <LinkIcon className="h-4 w-4" />
            </button>
            
            <button onClick={() => {
              const url = window.prompt("Image URL");
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }} className="p-2 rounded hover:bg-gray-100 text-gray-700">
              <ImageIcon className="h-4 w-4" />
            </button>

            <button onClick={() => {
              const url = window.prompt("YouTube URL");
              if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
            }} className="p-2 rounded hover:bg-gray-100 text-gray-700" title="Insert YouTube Video">
              <YoutubeIcon className="h-4 w-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="p-2 rounded hover:bg-gray-100 text-gray-700" title="Insert Table">
              <TableIcon className="h-4 w-4" />
            </button>
            {editor.isActive('table') && (
              <>
                <button onClick={() => editor.chain().focus().addColumnBefore().run()} className="p-1 px-2 text-xs font-medium rounded hover:bg-gray-100 text-gray-700 border border-gray-200">
                  +Col
                </button>
                <button onClick={() => editor.chain().focus().addRowBefore().run()} className="p-1 px-2 text-xs font-medium rounded hover:bg-gray-100 text-gray-700 border border-gray-200">
                  +Row
                </button>
                <button onClick={() => editor.chain().focus().deleteTable().run()} className="p-1 px-2 text-xs font-medium rounded hover:bg-red-50 text-red-600 border border-red-200">
                  Del Table
                </button>
              </>
            )}
          </div>
        )}

        <EditorContent editor={editor} />
        
      </main>
    </div>
  );
}
