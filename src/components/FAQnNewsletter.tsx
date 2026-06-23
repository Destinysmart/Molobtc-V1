import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    question: "What is thermodynamic security in Bitcoin?",
    answer: "Proof-of-Work links digital ledger security directly to physical thermodynamics. To publish a block of transactions, computing machines must spend massive amounts of electrical power solving millions of trillions of mathematical hashes. This energy expenditure cannot be faked or bypassed, anchoring digital consensus in physical laws so it becomes immutable."
  },
  {
    question: "Why is private key entropy physically unbreakable?",
    answer: "A standard Bitcoin private key is generated as 256 bits of pure random entropy (commonly represented as a 12 or 24-word seed phrase). The number of possible key configurations is greater than the total number of atoms in the observable universe. Brute-forcing or guessing a single correct key is physically impossible, requiring more energy than is produced by the solar system."
  },
  {
    question: "How does the Lightning Network scale Bitcoin safely off-chain?",
    answer: "The Lightning Network uses cryptographic state channels. Two peers lock funds into an on-chain transaction and then privately exchange signed, high-speed updates representing mutual balance updates. Only when peers decide to close the channel do they broadcast the finalized balance-sheet state to the main blockchain, retaining full on-chain security parameters at the speed of light."
  },
  {
    question: "What makes the UTXO model behave like physical cash?",
    answer: "Unlike modern online banking apps which record state balances, Bitcoin uses Unspent Transaction Outputs (UTXOs). Transactions spend whole, unique digital cash tokens (inputs) and generate brand new output outputs, returning 'change' addresses to your wallet. This cash-like architecture enables parallel payment processing, strict consensus predictability, and avoids double-spend bugs."
  }
];

export function FAQnNewsletter() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <section className="py-24 bg-gray-50 border-t border-gray-100" id="molo-faq">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <h2 className="heading-display text-3xl font-bold text-gray-900 mb-4">FAQ</h2>
              <p className="text-gray-550 text-sm leading-relaxed">Pristine answers to core physical, cryptographic, and mathematical inquiries about Molo BTC research models.</p>
            </div>
            
            <div className="md:col-span-3 space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="border-b border-gray-200 last:border-0"
                >
                  <button
                    className="w-full py-5 flex items-center justify-between text-left group"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    <span className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 text-gray-500 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-display text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Stay Tuned with Our Science Lab
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            Get the newest physical workspace insights, ELI5 visual models, and interactive Bitcoin research drops delivered directly.
          </p>

          <form className="mx-auto max-w-md flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-grow rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-sm"
            />
            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-6 py-3.5 font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-400">Join 15,000+ professionals. No spam, unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
