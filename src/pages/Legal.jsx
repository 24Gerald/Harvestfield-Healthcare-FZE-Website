// TODO: draft privacy notice — form collects program/contact data, confirm NDPR requirements
//
// Route stub only. The Request Supply form collects names, organisations and
// email addresses from institutional contacts, so a privacy notice under the
// Nigeria Data Protection Regulation (NDPR) / NDPA 2023 will be needed before
// launch. Confirm requirements with the client before drafting.
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { legal } from '../data/content'
import { site } from '../data/siteConfig'

export default function Legal() {
  useEffect(() => {
    const prev = document.title
    document.title = `Legal | ${site.shortName}`
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <section className="bg-white">
      <div className="container-site min-h-[70svh] pb-24 pt-32 md:pt-40">
        <p className="eyebrow text-teal-deep">{site.name}</p>
        <h1 className="mt-4 text-4xl font-bold text-teal-deep md:text-5xl">{legal.title}</h1>
        <p className="mt-6 max-w-xl text-lg text-ink/80">{legal.body}</p>
        <Link to="/" className="mt-10 inline-block text-sm font-semibold text-teal-deep underline-offset-4 hover:underline">
          ← Back to the site
        </Link>
      </div>
    </section>
  )
}
