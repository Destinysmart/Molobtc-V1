import { useRef, useState, useEffect } from "react";
import {
  ArrowUpRight,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { trackMediaClick } from "../services/analytics";

interface MentionItem {
  id: string;
  type: "article" | "video";
  format: string;
  title: string;
  description: string;
  source: string;
  url: string;
  actionText: string;
  mediaType: "image" | "youtube";
  imageUrl: string;
  youtubeId?: string;
  youtubeStart?: number;
}

const MENTIONS: MentionItem[] = [
  {
    id: "molobtc-profile",
    type: "article",
    format: "Project Profile",
    title: "What Is MoloBTC? Africa's Open-Source Bitcoin Project",
    description:
      "Bitcoin Africa Story's in-depth profile exploring MoloBTC as an open-source Bitcoin research, education, and policy initiative from South Africa translating Bitcoin across technology, law, and tax.",
    source: "Bitcoin Africa Story",
    url: "https://www.bitcoinafricastory.com/news/molobtc",
    actionText: "Read Article",
    mediaType: "image",
    imageUrl: "https://www.bitcoinafricastory.com/news/molobtc/og.jpg",
  },
  {
    id: "fmf-interview",
    type: "video",
    format: "Executive Discussion",
    title: "Can South Africa's Government Control Bitcoin?",
    description:
      "@jabulanijakes of MoloBTC sat down with David Ansara, CEO of the Free Market Foundation (FMF), to discuss South Africa's draft capital flow management regulations and government proposals regarding Bitcoin self-custody.",
    source: "Free Market Foundation",
    url: "https://www.youtube.com/watch?v=CM03_3vOqWM&t=9s",
    actionText: "Watch Discussion",
    mediaType: "youtube",
    youtubeId: "CM03_3vOqWM",
    youtubeStart: 9,
    imageUrl: "https://img.youtube.com/vi/CM03_3vOqWM/maxresdefault.jpg",
  },
  {
    id: "regulation-fight",
    type: "article",
    format: "Policy Analysis",
    title: "Can South Africa Control Bitcoin? The Regulation Fight",
    description:
      "Featured investigative news coverage breaking down South Africa's regulatory proposals and why MoloBTC's Jabu Jakes argues draft capital flow controls on Bitcoin self-custody are technically and constitutionally unenforceable.",
    source: "Bitcoin Africa Story",
    url: "https://www.bitcoinafricastory.com/news/can-south-africa-control-bitcoin-the-regulation-fight",
    actionText: "Read Analysis",
    mediaType: "image",
    imageUrl: "https://www.bitcoinafricastory.com/news/can-south-africa-control-bitcoin-the-regulation-fight/og.jpg",
  },
];

export function ExternalMentions() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const card = el.querySelector<HTMLElement>("[data-mention-card]");
    const cardWidth = card ? card.clientWidth + 24 : clientWidth;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(0, index), MENTIONS.length - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollTo = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>("[data-mention-card]");
    const cardWidth = card ? card.clientWidth + 24 : el.clientWidth * 0.8;
    const targetScroll =
      direction === "left"
        ? el.scrollLeft - cardWidth
        : el.scrollLeft + cardWidth;

    el.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-mention-card]");
    if (cards[idx]) {
      cards[idx].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setActiveIndex(idx);
    }
  };

  return (
    <section
      id="media"
      className="scroll-margin-top mb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      aria-label="Featured Coverage & Discussions"
    >
      {/* Header with Navigation Controls */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="heading-display text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Featured Coverage & Discussions
          </h2>
          <p className="text-neutral-600 text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl">
            External interviews and investigative articles featuring MoloBTC and{" "}
            <span className="font-semibold text-neutral-900">@jabulanijakes</span>{" "}
            discussing Bitcoin open-source research, self-custody, and South Africa&apos;s regulations.
          </p>
        </div>

        {/* Carousel Navigation Actions */}
        <div className="flex items-center gap-3 self-end shrink-0 pt-2 md:pt-0">
          <div className="text-xs font-mono font-bold text-neutral-500 mr-1 select-none">
            <span className="text-amber-600 font-extrabold text-sm">
              0{activeIndex + 1}
            </span>
            <span className="text-neutral-300"> / </span>
            <span>0{MENTIONS.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTo("left")}
              disabled={!canScrollLeft}
              aria-label="Previous coverage"
              className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center ${
                canScrollLeft
                  ? "bg-white hover:bg-neutral-50 text-neutral-800 shadow-sm border border-neutral-200/80 active:scale-95 cursor-pointer"
                  : "bg-neutral-100 text-neutral-300 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              onClick={() => scrollTo("right")}
              disabled={!canScrollRight}
              aria-label="Next coverage"
              className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center ${
                canScrollRight
                  ? "bg-white hover:bg-neutral-50 text-neutral-800 shadow-sm border border-neutral-200/80 active:scale-95 cursor-pointer"
                  : "bg-neutral-100 text-neutral-300 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Layout: 3-column grid on desktop, smooth carousel on mobile */}
      <div className="relative -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0">
        <div
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto lg:overflow-x-visible pb-4 pt-1 snap-x snap-mandatory lg:snap-none scroll-smooth no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {MENTIONS.map((item, idx) => {
            const isVideo = item.mediaType === "youtube";
            const isPlayingThisVideo = playingVideoId === item.id;

            return (
              <article
                key={item.id}
                data-mention-card
                className="group snap-center shrink-0 w-[84vw] sm:w-[380px] lg:w-auto flex flex-col justify-between bg-white rounded-3xl border border-neutral-200/70 p-5 sm:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-neutral-300/90 transition-all duration-300"
              >
                <div>
                  {/* Media Banner: Clean, without any badges, pill overlays, or eyebrow texts */}
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 mb-5 shadow-sm">
                    {isVideo && isPlayingThisVideo && item.youtubeId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?start=${item.youtubeStart || 0}&autoplay=1`}
                        title={item.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : isVideo ? (
                      <div className="relative w-full h-full">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/35 transition-colors" />

                        {/* Centered Modern Glass Play Button */}
                        <button
                          onClick={() => {
                            trackMediaClick(item.title, item.source, "youtube");
                            setPlayingVideoId(item.id);
                          }}
                          aria-label={`Play ${item.title}`}
                          className="absolute inset-0 m-auto w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 cursor-pointer border border-white/50"
                        >
                          <Play className="w-5 h-5 fill-neutral-900 text-neutral-900 translate-x-0.5" />
                        </button>
                      </div>
                    ) : (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener"
                        onClick={() => trackMediaClick(item.title, item.source, "article")}
                        className="block w-full h-full relative"
                        aria-label={item.title}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://www.bitcoinafricastory.com/assets/BitcoinAfricaStoryLogo.png";
                          }}
                        />
                        <div className="absolute inset-0 bg-neutral-950/10 group-hover:bg-neutral-950/20 transition-colors" />
                      </a>
                    )}
                  </div>

                  {/* Clean Editorial Metadata Line (Pure typography, no badges or pills) */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-2.5">
                    <span className="text-amber-600 font-bold uppercase tracking-wider text-[11px]">
                      {item.source}
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-neutral-500 font-medium text-[11px]">
                      {item.format}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="heading-display text-lg sm:text-xl font-bold text-neutral-950 leading-snug line-clamp-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener"
                      onClick={() => trackMediaClick(item.title, item.source, item.type)}
                      className="hover:text-amber-600 transition-colors"
                    >
                      {item.title}
                    </a>
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mt-2.5 line-clamp-3 font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Footer Link: Modern inline link with animated arrow */}
                <div className="pt-5 mt-5 border-t border-neutral-100 flex items-center justify-between">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener"
                    onClick={() => trackMediaClick(item.title, item.source, item.type)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:text-amber-600 transition-colors"
                  >
                    <span>{item.actionText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>

                  <span className="text-[11px] font-mono text-neutral-400 font-medium">
                    0{idx + 1}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile Dots Flow Indicator */}
        <div className="flex lg:hidden items-center justify-center gap-2 mt-6">
          {MENTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full h-1.5 ${
                activeIndex === i
                  ? "w-7 bg-amber-600"
                  : "w-2 bg-neutral-200 hover:bg-neutral-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
