import s from './landing.module.css';

/* Aivory Aether: the reasoning layer behind the Deep Diagnostic.
   Positioned as Aivory's mind, never as a model of its own: the models give
   Aivory language, Aether decides what to ask and what to recommend.
   Each card mirrors a real stage of the diagnostic state machine
   (website context -> adaptive questions -> recommendation). */

function Understands() {
  return (
    <div className={`${s.hwMock} ${s.aeMock}`} aria-hidden="true">
      <div className={s.aeSource}>
        <span className={s.aeDot} />
        Reading northwind-logistics.com
      </div>
      <dl className={s.aeProfile}>
        <div><dt>Industry</dt><dd>Freight forwarding</dd></div>
        <div><dt>Team</dt><dd>40 people</dd></div>
        <div><dt>Tools</dt><dd>Odoo, Gmail, Sheets</dd></div>
      </dl>
    </div>
  );
}

function Reasons() {
  return (
    <div className={`${s.hwMock} ${s.aeMock}`} aria-hidden="true">
      <div className={s.aeEcho}>You said invoices wait 3 days for approval</div>
      <div className={s.aeAsk}>Who signs them off today, and in which app?</div>
      <div className={s.aeChips}>
        <span data-sel>Finance lead, by email</span>
        <span>Owner, in Odoo</span>
      </div>
    </div>
  );
}

function Recommends() {
  return (
    <div className={`${s.hwMock} ${s.aeMock}`} aria-hidden="true">
      <div className={s.aePlanHead}>Your plan<small>3 steps</small></div>
      <ol className={s.aePlan}>
        <li><b>1</b>Match invoices to POs in Odoo</li>
        <li><b>2</b>Route approvals over $500</li>
        <li><b>3</b>Chase late payers automatically</li>
      </ol>
    </div>
  );
}

const CARDS = [
  { key: 'understands', title: 'Understands', body: 'Learns your business before it asks a single question', mock: <Understands /> },
  { key: 'reasons', title: 'Reasons', body: 'Every next question depends on your last answer', mock: <Reasons /> },
  { key: 'recommends', title: 'Recommends', body: 'Ends with a plan, not a chat log', mock: <Recommends /> },
];

export default function AetherSection() {
  return (
    <section id="aether" className={`${s.band} ${s.light}`}>
      <div className={s.wrap}>
        <div className={s.head}>
          <img
            className={s.aeLockup}
            src="/landing/aether/aivory-aether-black.svg"
            alt="Aivory Aether"
            width={421}
            height={40}
          />
          <h2 className={s.h2}>
            Models give Aivory language
            <br />
            <span className={s.dim}>Aether gives it judgment</span>
          </h2>
          <p className={s.lede}>
            Aether reads your business, asks what matters, and turns the answers into a plan you can act on
          </p>
        </div>
        <div className={s.ae}>
          {CARDS.map((c) => (
            <article key={c.key} className={s.hwCard}>
              <div className={s.hwCopy}>
                <h3>
                  {c.title} <span>{c.body}</span>
                </h3>
              </div>
              {c.mock}
            </article>
          ))}
        </div>
        <div className={`${s.row} ${s.aeCta}`}>
          <a className={s.btn} href="/free-diagnostic">Meet Aether in your Deep Diagnostic</a>
        </div>
      </div>
    </section>
  );
}
