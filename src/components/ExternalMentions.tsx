import React, { useRef, useState, useEffect } from "react";
import {
  ExternalLink,
  Play,
  Newspaper,
  Video,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface MentionItem {
  id: string;
  type: "article" | "video";
  badge: {
    label: string;
    icon: typeof Newspaper;
    bgClass: string;
    textClass: string;
  };
  title: string;
  description: string;
  source: string;
  url: string;
  actionText: string;
  mediaType: "image" | "youtube";
  imageUrl?: string;
  youtubeId?: string;
  youtubeStart?: number;
  highlight?: string;
}

const MENTIONS: MentionItem[] = [
  {
    id: "molobtc-profile",
    type: "article",
    badge: {
      label: "Project Profile • Bitcoin Africa Story",
      icon: BookOpen,
      bgClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20",
      textClass: "text-amber-600 dark:text-amber-400",
    },
    title: "What Is MoloBTC? Africa's Open-Source Bitcoin Project",
    description:
      "Bitcoin Africa Story's in-depth profile exploring MoloBTC as an open-source Bitcoin research, education, and policy initiative from South Africa translating Bitcoin across technology, law, and tax.",
    source: "Bitcoin Africa Story",
    url: "https://www.bitcoinafricastory.com/news/molobtc",
    actionText: "Read Full Article",
    mediaType: "image",
    imageUrl: "https://www.bitcoinafricastory.com/news/molobtc/og.jpg",
    highlight: "Exclusive Profile",
  },
  {
    id: "fmf-interview",
    type: "video",
    badge: {
      label: "Free Market Foundation (FMF) • Interview",
      icon: Video,
      bgClass: "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20",
      textClass: "text-red-600 dark:text-red-400",
    },
    title: "Can South Africa's Government Control Bitcoin?",
    description:
      "@jabulanijakes of MoloBTC sat down with David Ansara, CEO of the Free Market Foundation (FMF), to discuss South Africa's draft capital flow management regulations and government proposals regarding Bitcoin self-custody.",
    source: "FMF & YouTube",
    url: "https://www.youtube.com/watch?v=CM03_3vOqWM&t=9s",
    actionText: "Watch Interview",
    mediaType: "youtube",
    youtubeId: "CM03_3vOqWM",
    youtubeStart: 9,
    highlight: "Executive Discussion",
  },
  {
    id: "regulation-fight",
    type: "article",
    badge: {
      label: "Policy & Regulation • Bitcoin Africa Story",
      icon: Newspaper,
      bgClass: "bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20",
      textClass: "text-brand-600 dark:text-brand-400",
    },
    title: "Can South Africa Control Bitcoin? The Regulation Fight",
    description:
      "Featured investigative news coverage breaking down South Africa's regulatory proposals and why MoloBTC's Jabu Jakes argues draft capital flow controls on Bitcoin self-custody are technically and constitutionally unenforceable.",
    source: "Bitcoin Africa Story",
    url: "https://www.bitcoinafricastory.com/news/can-south-africa-control-bitcoin-the-regulation-fight",
    actionText: "Read Analysis",
    mediaType: "image",
    imageUrl: "https://www.bitcoinafricastory.com/news/can-south-africa-control-bitcoin-the-regulation-fight/og.jpg",
    highlight: "Regulatory Breakdown",
  },
];

export function ExternalMentions() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate approximate active slide based on scroll position
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).clientWidth + 24
      : clientWidth;
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

    const card = el.firstElementChild as HTMLElement | null;
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
      aria-label="External Mentions & Coverage"
    >
      {/* Header with Navigation Controls */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="heading-display text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Featured Coverage & Discussions
          </h2>
          <p className="text-gray-650 text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl">
            External interviews and investigative articles featuring MoloBTC and{" "}
            <span className="font-semibold text-gray-900">@jabulanijakes</span>{" "}
            discussing Bitcoin open-source research, self-custody, and South Africa&apos;s regulations.
          </p>
        </div>

        {/* Carousel Navigation Actions */}
        <div className="flex items-center gap-3 self-end shrink-0 pt-2 md:pt-0">
          <div className="text-xs font-mono font-bold text-gray-500 mr-1 select-none">
            <span className="text-brand-600 font-extrabold text-sm">
              0{activeIndex + 1}
            </span>
            <span className="text-gray-350"> / </span>
            <span>0{MENTIONS.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTo("left")}
              disabled={!canScrollLeft}
              aria-label="Previous coverage"
              className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center ${
                canScrollLeft
                  ? "bg-white hover:bg-gray-50 text-gray-800 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scrollTo("right")}
              disabled={!canScrollRight}
              aria-label="Next coverage"
              className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center ${
                canScrollRight
                  ? "bg-white hover:bg-gray-50 text-gray-800 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Flow Container */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-0 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-1 px-[6vw] sm:px-0 snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollPadding: "0 6vw",
          }}
        >
          {MENTIONS.map((item, idx) => {
            const BadgeIcon = item.badge.icon;
            const isVideo = item.mediaType === "youtube";

            return (
              <article
                key={item.id}
                data-mention-card
                className="snap-center shrink-0 w-[86vw] sm:w-[420px] md:w-[440px] lg:w-[410px] xl:w-[430px] flex flex-col justify-between bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-neutral-100 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group p-5 sm:p-6"
              >
                <div>
                  {/* Media Banner / Embed */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-950 mb-5 shadow-sm">
                    {isVideo && item.youtubeId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?start=${item.youtubeStart || 0}`}
                        title={item.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                      />
                    ) : (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/img block w-full h-full relative"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/img:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://www.bitcoinafricastory.com/assets/BitcoinAfricaStoryLogo.png";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover/img:opacity-60 transition-opacity" />
                        
                        {/* Overlay Badges */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium drop-shadow-sm">
                          <span className="bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] font-medium text-amber-300">
                            {item.source}
                          </span>
                          <span className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] text-gray-200 group-hover/img:text-white">
                            Read Article
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </a>
                    )}

                    {/* Top right pill if highlighted */}
                    {item.highlight && (
                      <div className="absolute top-2.5 right-2.5 pointer-events-none">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/70 text-white backdrop-blur-md">
                          {item.highlight}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Category Pill */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold mb-3 ${item.badge.bgClass}`}
                  >
                    <BadgeIcon className={`w-3.5 h-3.5 ${item.badge.textClass}`} />
                    <span>{item.badge.label}</span>
                  </div>

                  {/* Title */}
                  <h3 className="heading-display text-lg sm:text-xl font-bold text-gray-950 leading-snug line-clamp-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-600 transition-colors"
                    >
                      {item.title}
                    </a>
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-2.5 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Footer action */}
                <div className="pt-5 mt-4 flex items-center justify-between">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                      isVideo
                        ? "bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-brand-500/20"
                        : "bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
                    }`}
                  >
                    {isVideo ? (
                      <Play className="w-3.5 h-3.5 fill-white" />
                    ) : (
                      <Newspaper className="w-3.5 h-3.5" />
                    )}
                    <span>{item.actionText}</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-75" />
                  </a>

                  <span className="text-[11px] font-mono text-gray-400 font-medium">
                    0{idx + 1}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Dots Pagination Flow Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {MENTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full h-2 ${
                activeIndex === i
                  ? "w-8 bg-brand-500 shadow-sm shadow-brand-500/30"
                  : "w-2 bg-gray-200 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
