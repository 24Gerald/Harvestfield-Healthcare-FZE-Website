import { useState } from 'react'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import Button from '../components/Button'
import { submitSupplyRequest, FORM_NAME } from '../lib/formAdapter'
import { requestSupply as copy } from '../data/content'
import { site, FORM_BACKEND } from '../data/siteConfig'

/**
 * Request Supply form.
 *
 * Submission goes through src/lib/formAdapter.js — that file is the ONLY place
 * to change when pointing this form at a different backend. The markup here
 * carries the Netlify attributes so the deployed form also works with
 * JavaScript disabled (Netlify handles a plain POST).
 *
 * Keep the field names in sync with public/__forms.html.
 */
const inputClass =
  'mt-2 w-full rounded-xl border border-teal-deep/20 bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-teal-deep focus:outline-none focus:ring-2 focus:ring-teal-deep/20'

export default function RequestSupply() {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    if (data['bot-field']) return // honeypot tripped — silently ignore
    setStatus('submitting')
    try {
      await submitSupplyRequest({
        fullName: data.fullName,
        organization: data.organization,
        email: data.email,
        message: data.message,
      })
      setStatus('success')
      form.reset()
    } catch (err) {
      console.error('[request-supply]', err)
      setStatus('error')
    }
  }

  return (
    <section id={copy.id} className="scroll-mt-20 bg-teal-tint-solid">
      <div className="container-site section-pad">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Context */}
          <Reveal className="lg:col-span-5">
            <Eyebrow className="text-teal-deep">{copy.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-teal-deep sm:text-4xl lg:text-5xl">{copy.title}</h2>
            <ul className="mt-8 space-y-4">
              {copy.context.map((line) => (
                <li key={line} className="flex gap-3 text-base text-ink/85">
                  <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-teal-deep" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-muted">
              Prefer email?{' '}
              <a href={`mailto:${site.contactEmail}`} className="font-medium text-teal-deep underline-offset-4 hover:underline">
                {site.contactEmail}
              </a>
            </p>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1} className="lg:col-span-7">
            {status === 'success' ? (
              <div role="status" className="rounded-3xl bg-white p-8 md:p-10">
                <h3 className="text-2xl font-bold text-teal-deep">{copy.success.title}</h3>
                <p className="mt-3 text-base text-ink/80">{copy.success.body}</p>
                <Button variant="ghost" className="mt-8" onClick={() => setStatus('idle')}>
                  Send another request
                </Button>
              </div>
            ) : (
              <form
                name={FORM_NAME}
                method="POST"
                action="/"
                data-netlify={FORM_BACKEND === 'netlify' ? 'true' : undefined}
                netlify-honeypot="bot-field"
                onSubmit={onSubmit}
                className="rounded-3xl bg-white p-6 sm:p-8 md:p-10"
                noValidate={false}
              >
                <input type="hidden" name="form-name" value={FORM_NAME} />
                <p className="hidden">
                  <label>
                    Don’t fill this out if you’re human: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-teal-deep">
                    {copy.fields.fullName}
                    <input name="fullName" type="text" required autoComplete="name" className={inputClass} />
                  </label>
                  <label className="block text-sm font-semibold text-teal-deep">
                    {copy.fields.organization}
                    <input name="organization" type="text" autoComplete="organization" className={inputClass} />
                  </label>
                </div>
                <label className="mt-5 block text-sm font-semibold text-teal-deep">
                  {copy.fields.email}
                  <input name="email" type="email" required autoComplete="email" inputMode="email" className={inputClass} />
                </label>
                <label className="mt-5 block text-sm font-semibold text-teal-deep">
                  {copy.fields.message}
                  <textarea name="message" required rows={5} placeholder={copy.fields.messagePlaceholder} className={inputClass} />
                </label>

                {status === 'error' && (
                  <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                    <strong>{copy.error.title}</strong> {copy.error.body}{' '}
                    <a href={`mailto:${site.contactEmail}`} className="font-medium underline">
                      {site.contactEmail}
                    </a>
                    .
                  </p>
                )}

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" disabled={status === 'submitting'} className="disabled:opacity-60">
                    {status === 'submitting' ? 'Sending…' : copy.submit}
                  </Button>
                  <p className="text-xs text-muted">We reply within {site.replyTime}.</p>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
