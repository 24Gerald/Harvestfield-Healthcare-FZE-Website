/**
 * Admin panel configuration.
 * The password is never stored — only its SHA-256 hash, checked in the browser.
 * Real authority comes from the GitHub token entered on first login, which the
 * panel encrypts with the password and keeps in this browser's localStorage.
 */
export const ADMIN = {
  owner: '24Gerald',
  repo: 'Harvestfield-Healthcare-FZE-Website',
  branch: 'claude/new-session-g34dfl', // change to 'main' once the site lives there
  postsDir: 'content/posts',
  mediaDir: 'public/blog-media', // served by the site at /blog-media/<file>
  passwordHash: '79f0dcc971c0894120988e01886dcdd190bf4d8647fec39fcbe5c972e6c7e480',
  siteUrl: typeof window !== 'undefined' ? `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}` : '',
  workflowFile: 'pages.yml',
  maxImageEdge: 1800, // uploads are resized in the browser to keep the repo light
}
