import React, { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Minus, 
  Maximize2, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Printer, 
  FileText,
  Sparkles,
  RotateCcw
} from "lucide-react";
import { documentsData, DocPage } from "../services/pdfDocuments";

interface PdfPreviewCanvasProps {
  repoId: string;
  repoName: string;
  onDownload: () => void;
}

export function PdfPreviewCanvas({ repoId, repoName, onDownload }: PdfPreviewCanvasProps) {
  const [page, setPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const currentDoc = documentsData[repoId] || documentsData["bitcoin-self-custody-sovereign-infrastructure"];
  const totalPages = currentDoc.length;
  const currentPageContent = currentDoc[page - 1] || currentDoc[0];

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleZoomIn = () => {
    if (zoom < 1.6) setZoom(prev => Math.min(prev + 0.1, 1.6));
  };

  const handleZoomOut = () => {
    if (zoom > 0.7) setZoom(prev => Math.max(prev - 0.1, 0.7));
  };

  const handleResetZoom = () => {
    setZoom(1.0);
  };

  // Inline search text highlight logic
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-amber-200 text-black px-0.5 rounded-xs font-serif font-semibold">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div id="pdf-interactive-viewer" className="flex flex-col bg-gray-150 border border-gray-200 rounded-2xl overflow-hidden shadow-xs w-full h-[580px] font-sans">
      {/* Top Bar / Acrobat-style controls */}
      <div className="bg-gray-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 shadow-sm shrink-0 select-none">
        
        {/* Left: Doc Name */}
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-400 shrink-0" />
          <span className="text-[11px] sm:text-xs font-mono font-medium tracking-wide text-gray-300 max-w-[150px] sm:max-w-[240px] truncate">
            {repoId}_v1.pdf
          </span>
        </div>

        {/* Center: Page Navigation & Zoom */}
        <div className="flex items-center gap-4 sm:gap-6 mx-auto">
          {/* Pagination */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`p-1 rounded-md hover:bg-gray-800 transition-colors cursor-pointer ${page === 1 ? 'opacity-40 pointer-events-none' : 'text-gray-300 hover:text-white'}`}
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-gray-300 font-bold min-w-[64px] text-center bg-gray-950 px-2 py-0.5 rounded-md border border-gray-800">
              Page {page} / {totalPages}
            </span>
            <button 
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`p-1 rounded-md hover:bg-gray-800 transition-colors cursor-pointer ${page === totalPages ? 'opacity-40 pointer-events-none' : 'text-gray-300 hover:text-white'}`}
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-950 px-2 py-0.5 rounded-lg border border-gray-800">
            <button 
              onClick={handleZoomOut}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-gray-300 min-w-[38px] text-center font-semibold">
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={handleZoomIn}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            {zoom !== 1.0 && (
              <button 
                onClick={handleResetZoom}
                className="p-1 text-brand-400 hover:text-brand-300 hover:bg-gray-800 rounded-md transition-colors cursor-pointer border-l border-gray-800 ml-0.5 pl-1.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden md:block">
            <input 
              type="text"
              placeholder="Search in PDF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-950 text-white border border-gray-800 rounded-lg pl-8 pr-3 py-1 text-xs w-36 focus:outline-none focus:border-brand-500 placeholder-gray-500 transition-all font-sans"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <button 
            onClick={onDownload}
            className="text-xs bg-brand-500 hover:bg-brand-600 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
            title="Download Sovereign PDF Compilation"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Download</span>
          </button>
        </div>
      </div>

      {/* PDF Viewport Area */}
      <div className="flex-1 overflow-auto bg-gray-800 p-4 sm:p-6 flex justify-center items-start scroll-smooth relative">
        {/* Floating Search overlay for mobile */}
        <div className="md:hidden absolute top-2 right-4 z-20 bg-gray-900 border border-gray-700 p-1 rounded-lg flex items-center gap-1.5 shadow-lg max-w-[150px] sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-gray-400 ml-1.5 shrink-0" />
          <input 
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white text-xs py-0.5 focus:outline-none placeholder-gray-500 w-20 sm:w-28 font-sans"
          />
        </div>

        {/* Paper Sheet container */}
        <div 
          className="bg-[#FDFDFD] border border-gray-300 shadow-2xl rounded-sm p-8 sm:p-14 text-gray-900 relative transition-all duration-300 origin-top flex flex-col justify-between"
          style={{ 
            width: "100%",
            maxWidth: "680px",
            minHeight: "820px",
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            marginBottom: `${(zoom - 1.0) > 0 ? (zoom - 1.0) * 820 : 10}px` // Handle bottom margin on zoom scaling
          }}
        >
          {/* Running header */}
          {currentPageContent.header && (
            <div className="border-b border-gray-200 pb-1.5 mb-8 flex justify-between items-center text-[9px] font-mono tracking-widest text-gray-400 select-none">
              <span>{currentPageContent.header}</span>
              <span>CLASSIFIED NO: BSRF-M-{repoId.slice(0,4).toUpperCase()}</span>
            </div>
          )}

          {/* First Page Metadata */}
          {page === 1 && (
            <div className="text-center mb-8">
              {currentPageContent.title && (
                <h1 className="font-serif text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 leading-tight mb-2">
                  {highlightText(currentPageContent.title, searchQuery)}
                </h1>
              )}
              {currentPageContent.subtitle && (
                <p className="font-serif italic text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed mb-4">
                  {highlightText(currentPageContent.subtitle, searchQuery)}
                </p>
              )}
              <div className="w-16 h-0.5 bg-brand-500 mx-auto mb-4" />
              {currentPageContent.authors && (
                <p className="text-[10px] font-mono tracking-wider text-gray-700 uppercase mb-0.5 font-bold">
                  {currentPageContent.authors}
                </p>
              )}
              {currentPageContent.institution && (
                <p className="text-[9px] font-mono tracking-wide text-gray-400 uppercase select-none">
                  {currentPageContent.institution}
                </p>
              )}
            </div>
          )}

          {/* Abstract callout */}
          {page === 1 && currentPageContent.abstract && (
            <div className="bg-gray-50 border-l-2 border-brand-500 px-5 py-4 rounded-r-md mb-8 select-text">
              <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase text-brand-900 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-brand-500" />
                {currentPageContent.abstractTitle || "ABSTRACT"}
              </h4>
              <p className="font-serif text-xs leading-relaxed text-gray-700 italic text-justify">
                {highlightText(currentPageContent.abstract, searchQuery)}
              </p>
            </div>
          )}

          {/* Core scholarly sections */}
          <div className="flex-1 select-text space-y-6">
            {currentPageContent.sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-3">
                {sec.heading && (
                  <h3 className="font-serif text-sm font-bold tracking-wide text-gray-900 uppercase border-b border-gray-100 pb-1">
                    {highlightText(sec.heading, searchQuery)}
                  </h3>
                )}
                {sec.paragraphs.map((para, pIdx) => (
                  <p key={pIdx} className="font-serif text-xs leading-relaxed text-gray-800 text-justify indent-6">
                    {highlightText(para, searchQuery)}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Footnotes line and footnotes */}
          {currentPageContent.footnotes && currentPageContent.footnotes.length > 0 && (
            <div className="border-t border-gray-200 mt-12 pt-4 select-text">
              <div className="text-[9px] font-mono tracking-widest text-gray-400 uppercase mb-2 select-none">
                Footnotes & Citations
              </div>
              <div className="space-y-1.5">
                {currentPageContent.footnotes.map((fn, fIdx) => (
                  <p key={fIdx} className="font-serif text-[10px] leading-relaxed text-gray-500 italic text-justify pl-4 -indent-4">
                    {highlightText(fn, searchQuery)}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Footer of the paper sheet */}
          <div className="mt-8 pt-3 border-t border-gray-100 flex justify-between items-center text-[8px] font-mono text-gray-400 uppercase select-none">
            <span>MoloBTC Sovereign Research Institute</span>
            <span className="font-bold text-gray-600">Page {page} of {totalPages}</span>
            <span>https://github.com/MoloBTC-Org/bsrf</span>
          </div>
        </div>
      </div>
    </div>
  );
}
