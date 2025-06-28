import { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import DOMPurify from "dompurify";
import {
  Loader2,
  ArrowLeft,
  ImagePlus,
  BookOpen,
  Eye,
  Split,
  Save,
  LayoutDashboard,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";
import TiptapEditor from "../components/TipTapEditor";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

interface BookEditorProps {
  mode: "new" | "edit";
}

type PreviewMode = "write" | "preview" | "split";
type LayoutMode = "classic" | "minimal" | "focused";

export default function BookEditor({ mode }: BookEditorProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [coverUrl, setCoverUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("split");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("classic");
  const [unsaved, setUnsaved] = useState(false);
  type EditMode = "markdown" | "rich";
  const [editMode, setEditMode] = useState<EditMode>("markdown");

  const wordCount = useMemo(
    () => content.trim().split(/\s+/).filter(Boolean).length,
    [content]
  );
  const charCount = useMemo(() => content.length, [content]);

  useEffect(() => {
    (async () => {
      if (mode === "edit" && id) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from("books")
            .select("*")
            .eq("id", id)
            .single();
          if (error || !data)
            throw new Error(error?.message || "Book not found");
          setTitle(data.title);
          setSummary(data.summary);
          setGenre(data.genre ?? "");
          setStatus(data.status ?? "published");
          setCoverUrl(data.cover_url);
          setContent(data.content);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }

      const draftKey = id ? `draft-${id}` : "draft-new";
      try {
        const local = localStorage.getItem(draftKey);
        if (local) {
          const parsed = JSON.parse(local);
          if (
            parsed.content &&
            parsed.updated_at > Date.now() - 1000 * 60 * 60 * 24
          ) {
            setTitle(parsed.title ?? "");
            setSummary(parsed.summary ?? "");
            setGenre(parsed.genre ?? "");
            setCoverUrl(parsed.coverUrl ?? "");
            setContent(parsed.content ?? "");
          }
        }
      } catch (_) {
        console.warn("Invalid local draft format");
      }
    })();
  }, [mode, id]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !file.type.startsWith("image/")) return;
    uploadCover(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  async function uploadCover(file: File) {
    try {
      setError(null);
      setLoading(true);
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !/^\w+$/.test(ext))
        throw new Error("Invalid file extension.");
      const filePath = `covers/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("book-covers")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from("book-covers")
        .getPublicUrl(filePath);
      setCoverUrl(publicUrlData.publicUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const containsProfanity = (...texts: string[]) => {
    return texts.some((text) => matcher.hasMatch(text));
  };

  const containsMultilingualProfanity = async (
    ...texts: string[]
  ): Promise<boolean> => {
    try {
      const prompt = `You are a content moderation system for a PG-16 audience. Check if the following content includes **strong profanity**, **explicit sexual content**, or **hate speech** in any language. 
Mild language or light slang is acceptable. Only respond with "true" if the content is too inappropriate for a PG-16 audience. Otherwise, respond with "false".

${texts.join("\n---\n")}`;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const result = await response.json();
      const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text
        ?.trim()
        .toLowerCase();
      return reply === "true";
    } catch (err) {
      console.warn("Gemini profanity check failed", err);
      return false;
    }
  };

  const getOrCreateAuthor = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: author } = await supabase
      .from("authors")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (author) return author;
    const { data: newAuthor } = await supabase
      .from("authors")
      .insert({
        user_id: user.id,
        pen_name: user.email?.split("@")[0] ?? "Anonymous",
      })
      .select()
      .single();
    return newAuthor ?? null;
  };

  const handleSave = useCallback(
    async (isDraft = false, silent = false) => {
      try {
        if (!title.trim() || !summary.trim() || !content.trim())
          throw new Error("Title, summary and content are required.");
        const hasProfanity =
          containsProfanity(title, summary, content) ||
          (await containsMultilingualProfanity(title, summary, content));
        if (hasProfanity)
          throw new Error("Submission contains inappropriate language.");

        const author = await getOrCreateAuthor();
        if (!author) throw new Error("You must be logged in.");

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("No authenticated user found.");

        const payload = {
          title: DOMPurify.sanitize(title),
          summary: DOMPurify.sanitize(summary),
          genre: DOMPurify.sanitize(genre),
          status: isDraft ? "draft" : status,
          cover_url: coverUrl,
          content: DOMPurify.sanitize(content),
          user_id: user.id,
          author: author.id,
        };

        setLoading(true);
        let bookId: string | null = null;

        if (mode === "new") {
          const { data, error } = await supabase
            .from("books")
            .insert(payload)
            .select("id")
            .single();
          if (error) throw new Error(error.message);
          bookId = data?.id;
        }

        setUnsaved(false);
        navigate(`/book/${bookId}`);
      } catch (err: any) {
        if (!silent) setError(err.message);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [title, summary, genre, status, coverUrl, content, mode, id, navigate]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSave]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-bearBrown">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading…
      </div>
    );
  }
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 font-[Inter]">
      {/* Header & buttons */}
      <header className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/library"
            className="inline-flex items-center text-bearBrown hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Link>
          <span className="text-sm text-gray-400">
            {unsaved ? "Unsaved changes…" : "All changes saved"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm"
            value={layoutMode}
            onChange={(e) => setLayoutMode(e.target.value as LayoutMode)}
          >
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
            <option value="focused">Focused</option>
          </select>
          <Link
            to="/dashboard"
            className="rounded-full bg-white px-3 py-2 text-sm shadow hover:bg-gray-50"
          >
            <LayoutDashboard size={16} className="inline mr-1" /> Dashboard
          </Link>
          <button
            onClick={() => setPreviewMode("write")}
            className={`rounded-full p-2 transition ${
              previewMode === "write"
                ? "bg-bearBrown text-white"
                : "bg-gray-100"
            }`}
            title="Write only"
          >
            <BookOpen className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPreviewMode("preview")}
            className={`rounded-full p-2 transition ${
              previewMode === "preview"
                ? "bg-bearBrown text-white"
                : "bg-gray-100"
            }`}
            title="Preview only"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPreviewMode("split")}
            className={`rounded-full p-2 transition ${
              previewMode === "split" ? "bg-white" : "bg-gray-100"
            }`}
            title="Split view"
          >
            <Split className="h-4 w-4" />
          </button>
          <select
            className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm"
            value={editMode}
            onChange={(e) => setEditMode(e.target.value as EditMode)}
          >
            <option value="markdown">Markdown</option>
            <option value="rich">Rich Text</option>
          </select>

          <button
            onClick={() => handleSave(false)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[#f0f0f0] shadow-md hover:scale-105 transition"
          >
            <Save className="h-4 w-4" /> {mode === "new" ? "Publish" : "Save"}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-800 shadow-sm">
          {error}
        </div>
      )}

      <div
        className={`grid gap-8 ${
          layoutMode === "focused" ? "" : "lg:grid-cols-3"
        }`}
      >
        {/* Left panel */}
        {layoutMode !== "minimal" && (
          <div className="flex flex-col gap-6 lg:col-span-1">
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700">Title *</span>
              <input
                className="rounded-xl border p-3 border-gray-300 shadow-inner shadow-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700">Genre</span>
              <input
                className="rounded-xl border p-3 border-gray-300 shadow-md"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g., Cozy Mystery"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700">Summary *</span>
              <textarea
                className="h-28 resize-none rounded-xl border border-gray-300 p-3 shadow-md"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </label>
            {mode === "edit" && (
              <label className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700">Status</span>
                <select
                  className="rounded-xl border p-3 shadow-inner"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "draft" | "published")
                  }
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
            )}
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-gray-700">Cover Image</span>
              <div
                {...getRootProps()}
                className={`flex h-40 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-4 text-center text-gray-500 transition hover:border-bearBrown hover:text-bearBrown ${
                  isDragActive ? "bg-gray-100" : ""
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <ImagePlus className="h-6 w-6" />
                  <p>Drop cover here or click</p>
                </div>
              </div>
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt="Cover preview"
                  className="max-h-64 w-full rounded-lg object-cover shadow-md ring-1 ring-gray-200"
                />
              )}
            </div>
          </div>
        )}

        {/* Editor and preview */}
        <div
          className={`flex flex-col gap-6 ${
            layoutMode === "focused" ? "" : "lg:col-span-2"
          }`}
        >
          {(previewMode === "write" || previewMode === "split") && (
            <Fragment>
              {editMode === "markdown" ? (
                <textarea
                  className="min-h-[300px] w-full flex-1 resize-y rounded-xl border border-gray-200 p-4 font-mono text-sm shadow-inner"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setUnsaved(true);
                  }}
                  placeholder="Start typing your story using Markdown…"
                />
              ) : (
                <TiptapEditor
                  content={content}
                  setContent={(val) => {
                    setContent(val);
                    setUnsaved(true);
                  }}
                />
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {editMode === "markdown" ? "Markdown mode" : "Rich Text mode"}
                </span>
                <span>
                  {wordCount} words • {charCount} characters
                </span>
              </div>
            </Fragment>
          )}

          {(previewMode === "preview" || previewMode === "split") && (
            <div className="rounded-3xl bg-white/70 p-6 shadow-inner ring-1 ring-gray-100">
              <h2 className="mb-4 text-xl font-bold text-bearBrown">
                Live Preview
              </h2>
              <div className="prose max-w-none">
                {editMode === "markdown" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {content || "*Start typing your story…*"}
                  </ReactMarkdown>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(content),
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
