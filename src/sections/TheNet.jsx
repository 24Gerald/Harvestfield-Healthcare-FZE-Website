import { motion, useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import ProductShowcase from '../components/ProductShowcase'
import IngredientMesh from '../components/IngredientMesh'
import { net } from '../data/content'
import { EASE_OUT } from '../lib/motion'

/**
 * "The Net" — condensed to the two active-ingredient panels, the resistance
 * argument and the interactive pack. The three benefit tiles and the full
 * specification strip are held in src/data/content.js for the Synera DuoForte
 * page: the technical detail earns a page of its own, and at full length here
 * it obstructed the visitor forming a view of the company.
 *
 * The mesh diagram sits with the ingredient cards it annotates rather than
 * under the pack, which also evens out the two column heights.
 *
 * The attribution line sits directly under the copy, not in the footnotes:
 * GDM own the product, Harvestfield manufacture it, and the site says so where
 * the claim is made.
 */
export default function TheNet() {
  const reduce = useReducedMotion()
  return (
    <section id={net.id} className="scroll-mt-20 bg-white">
      <div className="container-site section-pad">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow className="text-teal-deep">{net.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal variant="rise" delay={0.08} duration={0.8}>
              <h2 className="mt-4 text-3xl font-bold text-teal-deep sm:text-4xl lg:text-5xl">{net.title}</h2>
            </Reveal>
            <Reveal delay={0.15} className="mt-6 space-y-5 text-base text-ink/85 md:text-lg">
              {net.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>

            {/* Active ingredients */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {net.ingredients.map((ai, i) => (
                <Reveal key={ai.name} delay={0.2 + i * 0.1}>
                  <motion.div
                    className="h-full rounded-2xl border border-teal-deep/15 p-5"
                    whileHover={reduce ? undefined : { y: -4, borderColor: 'rgba(16,81,91,0.45)' }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                  >
                    <p className="eyebrow text-muted">{ai.role}</p>
                    <p className="mt-2 text-lg font-semibold text-teal-deep">{ai.name}</p>
                    <p className="text-2xl font-bold tracking-heading text-ink">{ai.dose}</p>
                    <p className="mt-2 text-sm text-muted">{ai.detail}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <p className="mt-6 border-l-2 border-teal-soft pl-4 text-sm leading-relaxed text-muted">{net.attribution}</p>
            </Reveal>

            <Reveal delay={0.35} className="mt-8">
              <IngredientMesh ingredients={net.ingredients} />
              <p className="mt-3 text-xs text-muted">{net.meshNote}</p>
            </Reveal>
          </div>

          {/* Pack and mesh */}
          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <motion.div
                initial={reduce ? false : { clipPath: 'inset(0 0 0 100% round 24px)' }}
                whileInView={{ clipPath: 'inset(0 0 0 0% round 24px)' }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.1 }}
              >
                <ProductShowcase />
              </motion.div>
              <p className="mt-3 text-xs text-muted">{net.designerNote}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
