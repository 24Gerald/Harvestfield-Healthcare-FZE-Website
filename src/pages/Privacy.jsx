import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { privacy } from '../data/legal'
import { site } from '../data/siteConfig'

/**
 * Privacy & data notice. Content lives in src/data/legal.js so it can be
 * reviewed and edited without touching layout. Sections are anchored.
 */
export default function Privacy() {
  useEffect(() => {
    const prev = document.title
    document.title = `${privacy.title} | ${site.shortName}`
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <article className="bg-white">
      <div className="container-site pb-24 pt-32 md:pt-40">
        <div className="max-w-3xl">
          <p className="eyebrow text-teal-deep">{site.name}</p>
          <h1 className="mt-4 text-4xl font-bold text-teal-deep md:text-5xl">{privacy.title}</h1>
          <p className="mt-4 text-sm text-muted">
            Effective {privacy.effectiveDate} · Last updated {privacy.updatedDate}
          </p>
          <p className="mt-6 text-lg text-ink/85">{privacy.intro}</p>

          <nav aria-label="On this page" className="mt-10 rounded-2xl bg-teal-tint-solid p-6">
            <p className="eyebrow text-teal-deep">Contents</p>
            <ol className="mt-3 grid gap-2 sm:grid-cols-2">
              {privacy.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sm text-teal-deep underline-offset-4 hover:underline">
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {privacy.sections.map((s, i) => (
            <section key={s.id} id={s.id} className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-teal-deep">
                {i + 1}. {s.heading}
              </h2>
              {s.paragraphs.map((p, j) => (
                <p key={j} className="mt-4 text-base leading-relaxed text-ink/85">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-4 list-disc space-y-2 pl-6 text-base text-ink/85">
                  {s.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <p className="mt-16 text-sm text-muted">
            Questions about this notice:{' '}
            <a href={`mailto:${site.contactEmail}`} className="font-medium text-teal-deep underline-offset-4 hover:underline">
              {site.contactEmail}
            </a>
          </p>
          <Link to="/" className="mt-8 inline-block text-sm font-semibold text-teal-deep underline-offset-4 hover:underline">
            ← Back to the site
          </Link>
        </div>
      </div>
    </article>
  )
}
