import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Button from '../components/Button'
import { submitProposalRequest, PROPOSAL_FORM_NAME } from '../lib/formAdapter'
import { proposal as copy } from '../data/content'
import { site, FORM_BACKEND } from '../data/siteConfig'

/**
 * "Request a supply proposal" — the form behind the private & institutional
 * panel in the Supply section.
 *
 * Deliberately a separate form from the general enquiry on /contact: it asks
 * the questions needed to price and schedule a programme order, and submits
 * under its own form name so the two are distinguishable in the inbox. Keep
 * the field names in sync with public/__forms.html.
 */
const inputClass =
  'mt-2 w-full rounded-xl border border-teal-deep/20 bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-teal-deep focus:outline-none focus:ring-2 focus:ring-teal-deep/20'
const labelClass = 'block text-sm font-semibold text-teal-deep'

function Field({ label, children, className = '' }) {
  return (
    <label className={`${labelClass} ${className}`}>
      {label}
      {children}
    </label>
  )
}

export default function ProposalForm() {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const reduce = useReducedMotion()
  const f = copy.fields

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    if (data['bot-field']) return // honeypot tripped — silently ignore
    delete data['bot-field']
    delete data['form-name']
    setStatus('submitting')
    try {
      await submitProposalRequest(data)
      setStatus('success')
      form.reset()
    } catch (err) {
      console.error('[supply-proposal]', err)
      setStatus('error')
    }
  }

  return (
    <section id="request-proposal" className="scroll-mt-20 bg-teal-tint-solid">
      <div className="container-site section-pad">
        <Reveal className="mx-auto max-w-3xl">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'success' ? (
              <motion.div
                key="success"
                role="status"
                className="rounded-3xl bg-white p-8 md:p-10"
                initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
              >
                <span className="hf-pop inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-deep text-white" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path className="hf-draw" d="M6 14.5l5.5 5.5L22 9" />
                  </svg>
                </span>
                <h2 className="mt-6 text-2xl font-bold text-teal-deep">{copy.success.title}</h2>
                <p className="mt-3 text-base text-ink/80">{copy.success.body}</p>
                <Button variant="ghost" className="mt-8" onClick={() => setStatus('idle')}>
                  Send another request
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
                name={PROPOSAL_FORM_NAME}
                method="POST"
                action="/"
                data-netlify={FORM_BACKEND === 'netlify' ? 'true' : undefined}
                netlify-honeypot="bot-field"
                onSubmit={onSubmit}
                className="rounded-3xl bg-white p-6 sm:p-8 md:p-10"
              >
                <input type="hidden" name="form-name" value={PROPOSAL_FORM_NAME} />
                <p className="hidden">
                  <label>
                    Don’t fill this out if you’re human: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={f.organisation} className="sm:col-span-2">
                    <input name="organisation" type="text" required autoComplete="organization" className={inputClass} />
                  </Field>
                  <Field label={f.contactName}>
                    <input name="contactName" type="text" required autoComplete="name" className={inputClass} />
                  </Field>
                  <Field label={f.jobTitle}>
                    <input name="jobTitle" type="text" autoComplete="organization-title" className={inputClass} />
                  </Field>
                  <Field label={f.email}>
                    <input name="email" type="email" required autoComplete="email" inputMode="email" className={inputClass} />
                  </Field>
                  <Field label={f.phone}>
                    <input name="phone" type="tel" autoComplete="tel" inputMode="tel" className={inputClass} />
                  </Field>
                  <Field label={f.orgType}>
                    <select name="orgType" required defaultValue="" className={`${inputClass} pr-10`}>
                      <option value="" disabled>
                        {f.select}
                      </option>
                      {f.orgTypeOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={f.purpose}>
                    <select name="purpose" required defaultValue="" className={`${inputClass} pr-10`}>
                      <option value="" disabled>
                        {f.select}
                      </option>
                      {f.purposeOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={f.quantity}>
                    <input name="quantity" type="text" inputMode="numeric" className={inputClass} />
                  </Field>
                  <Field label={f.location}>
                    <input name="location" type="text" className={inputClass} />
                  </Field>
                  <Field label={f.deliveryDate} className="sm:col-span-2">
                    <input name="deliveryDate" type="date" className={inputClass} />
                  </Field>
                  <Field label={f.notes} className="sm:col-span-2">
                    <textarea name="notes" rows={4} placeholder={f.notesPlaceholder} className={inputClass} />
                  </Field>
                </div>

                {status === 'error' && (
                  <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                    <strong>{copy.error.title}</strong> {copy.error.body}{' '}
                    <a href={`mailto:${site.contactEmail}`} className="font-medium underline">
                      {site.contactEmail}
                    </a>
                    .
                  </p>
                )}

                <div className="mt-8">
                  <Button type="submit" disabled={status === 'submitting'} aria-busy={status === 'submitting'} className="min-w-[11rem] disabled:opacity-80">
                    {status === 'submitting' ? (
                      <>
                        <motion.span
                          aria-hidden="true"
                          className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                          animate={reduce ? undefined : { rotate: 360 }}
                          transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
                        />
                        Sending
                      </>
                    ) : (
                      copy.submit
                    )}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  )
}
