import s from './landing.module.css';

const STEPS = [
  {
    label: 'Step 1 · Assess',
    title: 'Diagnose how work really runs',
    body: 'A self-guided operations assessment maps every process, bottleneck and cost in one sitting.',
    mini: (
      <div className={s.mini}>
        <div className={s.miniRow}><span>Invoice approval</span><span className={s.pill}>38% manual</span></div>
        <div className={s.bar}><span style={{ width: '38%' }} /></div>
        <div className={s.miniRow}><span>Helpdesk triage</span><span className={s.pill}>61% manual</span></div>
        <div className={s.bar}><span style={{ width: '61%' }} /></div>
      </div>
    ),
  },
  {
    label: 'Step 2 · Blueprint',
    title: 'Get a deployment-ready blueprint',
    body: 'A concrete automation plan generated straight from your diagnostic, not a slide deck.',
    mini: (
      <div className={s.mini}>
        <div className={s.miniRow}><span>Quick-win automations</span><span className={s.pill}>7 found</span></div>
        <div className={s.miniRow}><span>Connects to</span><span>ERP · CRM · Helpdesk</span></div>
      </div>
    ),
  },
  {
    label: 'Step 3 · Deploy',
    title: 'Scale with governed agents',
    body: 'Agents run inside your stack with approvals, audit trails and role-based access.',
    mini: (
      <div className={s.mini}>
        <div className={s.miniRow}><span>Refund over $500</span><span className={s.pill}>Needs approval</span></div>
        <div className={s.miniRow}><span>Requested by</span><span>Finance agent</span></div>
      </div>
    ),
  },
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
        <div className={s.steps}>
          {STEPS.map((step) => (
            <article key={step.label} className={s.step}>
              <span className={s.stepN}>{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              {step.mini}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
