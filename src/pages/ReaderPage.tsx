import { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import {
  ArrowLeft,
  Minus,
  Plus,
  ArrowRightCircle,
  ArrowLeftCircle,
  LayoutList,
  LayoutGrid,
  BookOpen,
} from "lucide-react";

const WORDS_PER_PAGE = 250;

export default function BookReader() {
  const { id } = useParams<{ id: string }>();
  const { book, loading } = useBooks(id);

  const [fontSize, setFontSize] = useState(() => {
    const stored = localStorage.getItem("font-size");
    return stored ? Number(stored) : 18;
  });

  const [layoutMode, setLayoutMode] = useState<"single" | "double" | "scroll">(
    () => {
      return (
        (localStorage.getItem("layout-mode") as
          | "single"
          | "double"
          | "scroll") || "double"
      );
    }
  );

  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const isMarkdown = useMemo(() => {
    // crude check: if content contains lots of HTML tags, assume it's rich text
    if (!book?.content) return true;
    return !/<\/?[a-z][\s\S]*>/i.test(book.content);
  }, [book?.content]);

  const pages = useMemo(() => {
    if (!book?.content) return [];

    let blocks: string[] = [];

    if (isMarkdown) {
      // Split by double newlines
      blocks = book.content
        .split(/\n{2,}/g)
        .map((b) => b.trim())
        .filter(Boolean);
    } else {
      // For rich text HTML: split on </p> or <br>
      blocks = book.content
        .split(/<\/p>|<br\s*\/?>/gi)
        .map((b) => b.replace(/<[^>]+>/g, "").trim()) // Strip HTML for word count
        .filter(Boolean);
    }

    const grouped: string[] = [];
    let current: string[] = [];
    let wordCount = 0;

    for (const block of blocks) {
      const wordsInBlock = block.split(/\s+/).length;
      if (wordCount + wordsInBlock > WORDS_PER_PAGE) {
        grouped.push(current.join(isMarkdown ? "\n\n" : "<br/><br/>"));
        current = [];
        wordCount = 0;
      }

      current.push(block);
      wordCount += wordsInBlock;
    }

    if (current.length > 0)
      grouped.push(current.join(isMarkdown ? "\n\n" : "<br/><br/>"));
    return grouped;
  }, [book?.content, isMarkdown]);

  const totalPages = pages.length;

  const handleScroll = useCallback(() => {
    const doc = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    const pct = (doc.scrollTop / total) * 100;
    setProgress(pct);
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    localStorage.setItem("font-size", String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("layout-mode", layoutMode);
  }, [layoutMode]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "+") setFontSize((f) => Math.min(f + 2, 32));
      if (e.key === "-") setFontSize((f) => Math.max(f - 2, 14));
      if (e.key === "ArrowRight")
        setCurrentPage((p) => Math.min(p + 2, totalPages - 1));
      if (e.key === "ArrowLeft") setCurrentPage((p) => Math.max(p - 2, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages]);

  if (loading) return <p className="p-6 text-center">Loading…</p>;
  if (!book) return <p className="p-6 text-center">Book not found.</p>;

  return (
    <Fragment>
      {/* Progress Bar */}
      <div
        style={{ width: `${progress}%` }}
        className="fixed top-0 left-0 h-1 bg-bearBrown z-50 transition-all duration-300"
      />

      {/* Main Wrapper */}
      <div className="h-screen w-screen bg-[#fdfbf7] text-[#3E2723] font-serif flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-[#f1e8cd] shadow-sm px-4 sm:px-6 py-3 flex justify-between items-center">
          <Link
            to={`/book/${book.id}`}
            className="inline-flex items-center gap-1 text-bearBrown hover:underline text-sm font-medium transition"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {(["single", "double", "scroll"] as const).map((mode) => {
              const icons = {
                single: <LayoutList size={18} />,
                double: <BookOpen size={18} />,
                scroll: <LayoutGrid size={18} />,
              };
              return (
                <button
                  key={mode}
                  onClick={() => setLayoutMode(mode)}
                  title={`${mode.charAt(0).toUpperCase()}${mode.slice(1)} View`}
                  className={`p-2 rounded transition ${
                    layoutMode === mode
                      ? "bg-bearBrown/10 text-bearBrown"
                      : "text-gray-500 hover:text-bearBrown hover:bg-bearBrown/10"
                  }`}
                >
                  {icons[mode]}
                </button>
              );
            })}

            <button
              onClick={() => setFontSize((f) => Math.max(f - 2, 14))}
              className="p-2 rounded hover:bg-bearBrown/10"
              title="Decrease font"
            >
              <Minus size={16} />
            </button>
            <span className="text-xs w-8 text-center">{fontSize}px</span>
            <button
              onClick={() => setFontSize((f) => Math.min(f + 2, 32))}
              className="p-2 rounded hover:bg-bearBrown/10"
              title="Increase font"
            >
              <Plus size={16} />
            </button>
          </div>
        </header>

        {/* Reader Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 flex justify-center items-start bg-[#fdfbf7]">
          {layoutMode === "scroll" && (
            <div className="w-full max-w-screen-md flex flex-col gap-8 animate-fadeIn">
              {pages.map((index) => (
                <div
                  key={index}
                  style={{ fontSize }}
                  className="prose prose-lg max-w-none font-serif prose-headings:text-bearBrown prose-img:rounded-xl prose-a:text-bearBrown hover:prose-a:underline bg-white rounded-xl p-6 shadow-md border border-[#e9dec5] transition-all"
                >
                  {isMarkdown ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    >
                      {pages[currentPage] || ""}
                    </ReactMarkdown>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: pages[currentPage] || "",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {layoutMode === "single" && (
            <div className="w-full max-w-screen-md animate-fadeIn">
              <div
                style={{ fontSize }}
                className="prose prose-lg max-w-none font-serif prose-headings:text-bearBrown prose-img:rounded-xl prose-a:text-bearBrown hover:prose-a:underline bg-white rounded-xl p-6 shadow-md border border-[#e9dec5] transition-all"
              >
                {isMarkdown ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  >
                    {pages[currentPage] || ""}
                  </ReactMarkdown>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: pages[currentPage] || "",
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {layoutMode === "double" && (
            <div className="w-full max-w-screen-xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn flip-container">
              {[0, 1].map((offset) => {
                return (
                  <div
                    key={offset}
                    style={{ fontSize }}
                    className="flip-card animate-page prose prose-lg max-w-none font-serif prose-headings:text-bearBrown prose-img:rounded-xl prose-a:text-bearBrown hover:prose-a:underline bg-white rounded-xl p-6 shadow-md border border-[#e9dec5] transition-all min-h-[20rem]"
                  >
                    {isMarkdown ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      >
                        {pages[currentPage] || ""}
                      </ReactMarkdown>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: pages[currentPage] || "",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {layoutMode !== "scroll" && (
          <footer className="flex justify-between items-center px-4 sm:px-6 py-4 bg-[#fff8e1] text-bearBrown border-t border-[#f1e8cd] shadow-inner">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => Math.max(p - 2, 0))}
              className="inline-flex items-center gap-1 px-4 py-2 rounded hover:bg-bearBrown/10 disabled:opacity-30"
            >
              <ArrowLeftCircle size={18} />
              Prev
            </button>
            <p className="text-sm font-medium">
              Page {currentPage + 1}
              {pages[currentPage + 1] ? `–${currentPage + 2}` : ""} of{" "}
              {totalPages}
            </p>
            <button
              disabled={currentPage + 2 >= totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 2, totalPages - 1))
              }
              className="inline-flex items-center gap-1 px-4 py-2 rounded hover:bg-bearBrown/10 disabled:opacity-30"
            >
              Next
              <ArrowRightCircle size={18} />
            </button>
          </footer>
        )}
      </div>
    </Fragment>
  );
}
