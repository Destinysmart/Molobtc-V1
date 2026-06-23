import { FileText, Download, FileSignature, Presentation } from "lucide-react";
import { motion } from "motion/react";

const resources = [
  {
    title: "Freelance Contract Template",
    description: "A standardized legal agreement optimized for Bitcoin payments and milestone deliverables.",
    icon: FileSignature,
  },
  {
    title: "Proposal Framework",
    description: "The exact structure high-earning developers use to pitch Bitcoin-native startups.",
    icon: Presentation,
  },
  {
    title: "Bitcoin Invoice Template",
    description: "Professional invoice design with embedded Lightning QR codes and on-chain addresses.",
    icon: FileText,
  },
  {
    title: "Client Outreach Scripts",
    description: "Tested cold-email templates to initiate conversations with Web3 founders.",
    icon: Download,
  }
];

export function ResourcesHub() {
  return (
    <section className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="heading-display text-2xl font-bold text-gray-900 tracking-tight">Popular Resources</h2>
          <p className="text-gray-500 mt-2 text-sm">Downloadable templates and guides to streamline your independent career.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((res, index) => {
            const Icon = res.icon;
            return (
              <motion.a
                key={index}
                href="#"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-brand-300 hover:shadow-sm transition-all flex flex-col"
              >
                <div className="mb-4 text-brand-500">
                  <Icon className="h-6 w-6 stroke-[1.5]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{res.title}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">
                  {res.description}
                </p>
                <div className="flex items-center text-xs font-semibold text-brand-600">
                  <span className="group-hover:underline">Download Free PDF</span>
                </div>
              </motion.a>
            );
          })}
        </div>
        
        {/* Contextual Conversion CTA */}
        <div className="mt-16 rounded-3xl bg-white border border-orange-100 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg shadow-orange-50/20">
          <div>
             <h3 className="text-lg font-bold text-gray-950">Ready to explore further?</h3>
             <p className="text-gray-500 text-sm mt-1">Check out our developer guides or ask Molo AI if you need custom explanations.</p>
          </div>
          <a href="#ai-explorer" className="rounded-xl bg-gray-950 hover:bg-gray-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors whitespace-nowrap shadow-sm inline-flex items-center gap-1.5">
            Ask Molo AI Router
          </a>
        </div>
      </div>
    </section>
  );
}
