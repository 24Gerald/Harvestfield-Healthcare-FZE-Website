import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { faqs } from '../data/faq'
import { faqSection } from '../data/content'

function Item({ item, open, onToggle, index }) {
  const reduce = useReducedMotion()
  const panelId = `faq-panel-${item.id}`
  const buttonId = `faq-button-${item.id}`

  return (
    <Reveal as="li" delay={index * 0.06} className="border-b border-teal-deep/15">
      <h3>
        <button
          id={buttonId}
          type="button"
          className="flex w-full items-start justify-between gap-6 py-5 text-left text-base font-semibold text-teal-deep transition-colors hover:text-teal-deeper md:text-lg"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span>{item.question}</span>
          <span
            className={`mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border border-teal-deep/30 transition-transform duration-300 ease-brand ${
              open ? 'rotate-45' : ''
            }`}
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 1v10M1 6h10" /></svg>
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="overflow-hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <p className="pb-6 pr-10 text-base text-ink/80">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  )
}

export default function FAQ() {
  const [openId, setOpenId] = useState(faqs[0]?.id ?? null)

  return (
    <section id={faqSection.id} className="scroll-mt-20 bg-white">
      <div className="container-site section-pad">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <Eyebrow className="text-teal-deep">{faqSection.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-teal-deep sm:text-4xl">{faqSection.title}</h2>
          </Reveal>
          <ul className="border-t border-teal-deep/15 lg:col-span-8">
            {faqs.map((item, i) => (
              <Item
                key={item.id}
                item={item}
                index={i}
                open={openId === item.id}
                onToggle={() => setOpenId((cur) => (cur === item.id ? null : item.id))}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
