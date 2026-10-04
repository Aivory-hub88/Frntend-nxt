import { FAQ_ENTITIES } from '@/lib/seo';
import s from './landing.module.css';

// FAQ stays visible here: the homepage FAQPage JSON-LD is built from the same
// FAQ_ENTITIES, and structured data has to match on-page content.
export default function ClosingCTA() {
  return (
    <section id="strategy-cta" className={`${s.band} ${s.dark} ${s.glow}`}>
      <div className={s.wrap}>
        <div className={s.cta}>
          <h2 className={s.h2}>
            Start your transformation.
            <br />
            <span className={s.dim}>Prefer speaking with our team?</span>
          </h2>
          <div className={s.row}>
            <a className={s.btn} href="/free-diagnostic">Start free diagnostic</a>
            <a
              className={`${s.btn} ${s.ghost}`}
              href="https://book.aivory.uk/book/aivory-call"
              target="_blank"
              rel="noopener noreferrer"
            >
              Schedule a Discovery Call
            </a>
          </div>
        </div>

        <h3 className={s.faqHead}>Clear answers about Aivory.</h3>
        <div className={s.faq} style={{ marginTop: 0 }}>
          {FAQ_ENTITIES.map((entry, index) => (
            <details key={entry.question} open={index === 0}>
              <summary>
                <span>{entry.question}</span>
                <span aria-hidden="true">+</span>
              </summary>
              <p>{entry.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
