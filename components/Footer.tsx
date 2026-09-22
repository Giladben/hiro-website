const cols = [
  { title: 'המוצר', items: [
    { href: '/recruiters', label: 'למגייסים' },
    { href: '/candidates', label: 'למועמדים' },
    { href: '/recruiters#feature-job-sonar', label: 'Job Sonar' },
    { href: '/recruiters#feature-ai-match', label: 'תבנית התאמה' },
    { href: '/candidates#feature-tracker', label: 'מעקב הגשות' },
  ] },
  { title: 'Hiro', items: [
    { href: '/blog', label: 'בלוג' },
    { href: '/contact', label: 'צור קשר' },
    { href: 'https://app.hiro.co.il', label: 'כניסה למערכת' },
  ] },
  { title: 'מידע', items: [
    { href: '/privacy', label: 'מדיניות פרטיות' },
    { href: '/terms', label: 'תנאי שימוש' },
    { href: '/accessibility', label: 'הצהרת נגישות' },
  ] },
]

export function Footer() {
  return (
    <footer role="contentinfo" className="ft">
      <div className="ft-in">
        <div className="ft-top">
          <div className="ft-brand">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo */}
            <img src="/images/hiro-lockup-reversed.svg" alt="Hiro" width={81} height={34} />
            <p>מערכת גיוס ו-CRM למגייסים ולמשרדי השמה, ומרכז קריירה אישי למועמדים.</p>
          </div>
          {cols.map(col => (
            <nav key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.items.map(i => <li key={i.label}><a href={i.href}>{i.label}</a></li>)}
              </ul>
            </nav>
          ))}
        </div>
        <div className="ft-bottom">
          <span>© {new Date().getFullYear()} Hiro. כל הזכויות שמורות.</span>
          <span>נבנה בישראל</span>
        </div>
      </div>
      <style>{`
        .ft { background: #0F0E14; color: #A6A2B3; padding: 5rem 0 2rem; margin-top: 4rem; }
        .ft-in { max-width: 1240px; margin: 0 auto; padding: 0 2rem; }
        .ft-top { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 3rem; padding-bottom: 4rem; }
        .ft-brand img { height: 30px; width: auto; margin-bottom: 1.25rem; }
        .ft-brand p { max-width: 22rem; line-height: 1.7; font-size: .95rem; margin: 0; }
        .ft h3 { color: #F2F0EA; font-family: var(--font-sans); font-size: .85rem; font-weight: 600 !important; margin: 0 0 1.1rem; }
        .ft ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .7rem; }
        .ft ul a { color: #A6A2B3; text-decoration: none; font-size: .92rem; transition: color .2s; }
        .ft ul a:hover { color: #F2F0EA; }
        .ft-bottom { border-top: 1px solid #2A2833; padding-top: 1.75rem; display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; font-size: .82rem; }
        @media (max-width: 860px) {
          .ft-top { grid-template-columns: 1fr 1fr; }
          .ft-brand { grid-column: 1 / -1; }
          .ft-in { padding: 0 1.25rem; }
        }
      `}</style>
    </footer>
  )
}
