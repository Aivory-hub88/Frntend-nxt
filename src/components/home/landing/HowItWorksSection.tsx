import s from './landing.module.css';

/* Illustrations of the real product in the landing's iOS light glass look:
   the Deep Diagnostic chat, the blueprint report, an agent approval. */

function Diagnose() {
  return (
    <div className={`${s.hwMock} ${s.hwChat}`} aria-hidden="true">
      <div className={s.hwPhase}>
        <span>Phase 2 of 4 · Operations &amp; data foundation</span>
        <span className={s.hwSegs}><i data-on /><i data-on /><i /><i /></span>
      </div>
      <div className={s.hwQ}>Which processes take the most manual effort?</div>
      <div className={s.hwOpts}>
        <div className={s.hwOpt} data-sel><b>✓</b><span>Invoice approval</span><em>38% manual</em></div>
        <div className={s.hwOpt} data-sel><b>✓</b><span>Helpdesk triage</span><em>61% manual</em></div>
        <div className={s.hwOpt}><b>3</b><span>Customer onboarding</span></div>
      </div>
    </div>
  );
}

function Blueprint() {
  return (
    <div className={`${s.hwMock} ${s.hwReport}`} aria-hidden="true">
      <div className={s.hwBig}><strong>7</strong><span>quick-win automations found</span></div>
      <ul className={s.hwList}>
        <li><i data-c="green" />Invoice matching<small>Odoo</small></li>
        <li><i data-c="blue" />Ticket triage<small>Helpdesk</small></li>
        <li><i data-c="orange" />Lead routing<small>CRM</small></li>
      </ul>
    </div>
  );
}

function Deploy() {
  return (
    <div className={s.hwDeploy} aria-hidden="true">
      <div className={`${s.hwMock} ${s.hwApprove}`}>
        <div className={s.hwApproveTop}>
          <span className={s.hwAv}>FA</span>
          <div>
            <b>Refund over $500</b>
            <small>Requested by Finance agent</small>
          </div>
          <span className={s.hwChip}>Needs approval</span>
        </div>
        <div className={s.hwBtns}><span data-p>Approve</span><span>Decline</span></div>
      </div>
      <ol className={`${s.hwMock} ${s.hwAudit}`}>
        <li><i />Finance agent drafted the refund<small>09:41</small></li>
        <li><i />Sent to Finance lead for approval<small>09:41</small></li>
        <li><i data-ok />Approved and posted to Odoo<small>09:43</small></li>
      </ol>
    </div>
  );
}

const CARDS = [
  { n: 1, tone: 'blue', cls: s.hwA, title: 'Diagnose how work really runs.', body: 'A self-guided analysis maps every process, bottleneck and cost in one sitting.', mock: <Diagnose /> },
  { n: 2, tone: 'lilac', cls: s.hwB, title: 'Get a deployment-ready blueprint.', body: 'A concrete automation plan from your diagnostic, not a slide deck.', mock: <Blueprint /> },
  { n: 3, tone: 'green', cls: s.hwC, title: 'Scale with governed agents.', body: 'Agents run inside your stack with approvals, audit trails and role-based access.', mock: <Deploy /> },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className={`${s.band} ${s.light}`}>
      <div className={s.wrap}>
        <div className={s.head}>
          <span className={s.eyebrow}>How it works</span>
          <h2 className={s.h2}>
            Most organisations deploy AI
            <br />
            <span className={s.dim}>before understanding how work gets done.</span>
          </h2>
          <p className={s.lede}>
            We reverse the model. Start with a diagnostic, get a blueprint, then scale with governed AI agents.
          </p>
          <div className={s.row}>
            <a className={s.btn} href="/free-diagnostic">Start free diagnostic</a>
            <a className={`${s.btn} ${s.ghost}`} href="#cervo">See how it works</a>
          </div>
        </div>
        <div className={s.hw}>
          {CARDS.map((c) => (
            <article key={c.n} className={`${s.hwCard} ${c.cls}`} data-tone={c.tone}>
              <div className={s.hwCopy}>
                <span className={s.hwNum}>{c.n}</span>
                <h3>
                  {c.title} <span>{c.body}</span>
                </h3>
              </div>
              {c.mock}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
