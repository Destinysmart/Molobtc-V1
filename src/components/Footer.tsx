import { Bitcoin } from "lucide-react";

export function Footer() {
  return (
    <>
      {/* Contextual CTA */}
      <section className="bg-gradient-to-b from-white to-[#FFFBF7] border-t border-gray-100 py-16 px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="heading-display text-2xl font-bold text-gray-900 mb-4">
            Demystify Bitcoin for Everyone
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Molo BTC is an open-source hub. All of our summaries, explainers, and physics breakdowns are hosted transparently on our GitHub organization. Fork our work, suggest improvements, or submit your own research scripts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <a href="https://github.com/MoloBTC-Org" target="_blank" rel="noreferrer" className="w-full sm:w-auto rounded-xl bg-gray-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-all shadow-md inline-flex items-center justify-center gap-2">
               Explore Molo BTC on GitHub
             </a>
             <a href="#ai-explorer" className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-all inline-flex items-center justify-center">
               Ask Molo AI a Question
             </a>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-[#FFFBF7] border-t border-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start justify-between gap-8 text-sm">
          <div className="max-w-md space-y-4">
            <div className="flex items-center h-10">
              <img 
                src="/src/assets/images/molobtc_official_logo_1781542833685.jpg" 
                alt="Molo BTC Logo" 
                className="h-9 w-auto object-contain transform hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-gray-600 leading-relaxed text-xs">
              MoloBTC is an open-source Bitcoin research and discovery platform helping Africans understand, navigate, and participate in the Bitcoin ecosystem.
            </p>
            <div className="text-[11px] text-brand-600 font-bold tracking-wide uppercase space-y-1">
              <div>Research Bitcoin.</div>
              <div>Discover Opportunities.</div>
              <div>Navigate The Ecosystem.</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Quick Navigation</span>
            <div className="flex flex-wrap gap-4 md:flex-col md:gap-3 text-gray-500 font-medium">
              <a href="/#research" className="hover:text-gray-900 transition-colors">Research</a>
              <a href="/#opportunities" className="hover:text-gray-900 transition-colors">Molo AI</a>
              <a href="/#donate" className="hover:text-gray-900 transition-colors">Support & Donate</a>
              <a href="https://github.com/MoloBTC-Org" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">GitHub profile</a>
            </div>
          </div>
          
          <p className="text-gray-400 self-end text-right text-xs">© {new Date().getFullYear()} Molo BTC. Open Source under Apache-2.0.</p>
        </div>
      </footer>
    </>
  );
}
