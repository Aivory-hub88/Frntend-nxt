import s from './landing.module.css';

// Mirrors the user dashboard's workflow canvas: pill nodes tinted by category,
// dotted canvas, dashed animated connectors (styles/workflow-nodes.css there).
type Category = 'trigger' | 'ai' | 'app' | 'condition' | 'channel' | 'action';

const ICON: Record<string, string> = {
  mail: 'M3 5h18v14H3zM3 7l9 6 9-6',
  spark: 'M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8zM18 15l.9 2.1 2.1.9-2.1.9L18 21l-.9-2.1-2.1-.9 2.1-.9z',
  match: 'M9 5H5v4M15 5h4v4M9 19H5v-4M15 19h4v-4M8 12h8',
  branch: 'M6 3v6a6 6 0 006 6 6 6 0 016 6M18 3v6a6 6 0 01-6 6',
  chat: 'M4 5h16v11H8l-4 4z',
  check: 'M5 12l5 5L20 7',
  doc: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5',
};

function Node({ c, icon, title, sub }: { c: Category; icon: keyof typeof ICON; title: string; sub: string }) {
  return (
    <div className={s.wn} data-c={c}>
      <span className={s.wi}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={ICON[icon]} />
        </svg>
      </span>
      <span className={s.wt}>
        <b>{title}</b>
        <small>{sub}</small>
      </span>
    </div>
  );
}

function Edge() {
  return (
    <svg className={s.we} viewBox="0 0 20 34" aria-hidden="true">
      <path d="M10 0V28" />
      <polygon points="5,26 15,26 10,34" />
    </svg>
  );
}

export default function WorkflowBuilderSection() {
  return (
    <section id="workflow-builder" className={`${s.band} ${s.dark} ${s.glow}`}>
      <div className={s.wrap}>
        <div className={s.head}>
          <span className={s.eyebrow}>Workflow builder</span>
          <h2 className={s.h2}>
            Describe the process in plain language
            <br />
            <span className={s.dim}>Aivory builds the workflow.</span>
          </h2>
          <p className={s.lede}>
            No flowchart editor to learn. Write it the way you would brief a colleague, then review each step before
            it goes live.
          </p>
        </div>

        <div className={s.builder}>
          <div className={s.wfp}>
            <div className={s.wfpH}>
              <span>Build with Aivory</span>
            </div>
            <div className={s.wfpC}>
              <div className={s.wfpCtx}>
                <span className={s.wfpLabel}>Workspace</span>
                <b>Finance Operations</b>
              </div>
              <span className={s.wfpLabel}>Describe the workflow</span>
              <div className={s.wfpBox}>
                When an <mark>invoice email</mark> lands in Gmail, read the PDF and{' '}
                <mark>match it to the purchase order</mark> in Odoo. If the amount is <mark>over $500</mark>, ask
                Finance to approve in Slack. Then <mark>post the bill</mark> to Odoo.
              </div>
              <div className={s.wfpPre}>
                <span>Invoice intake</span>
                <span>Lead routing</span>
                <span>Ticket triage</span>
                <span>Weekly report</span>
              </div>
              <div className={s.wfpF}>
                <small>English, Bahasa Indonesia and 9 more</small>
                {/* Part of the illustration, not a control. */}
                <span className={s.wfpBtn} aria-hidden="true">Generate workflow</span>
              </div>
            </div>
          </div>

          <div className={s.wfc} aria-label="Generated workflow">
            <Node c="trigger" icon="mail" title="New email with PDF" sub="Trigger · Gmail, Finance inbox" />
            <Edge />
            <Node c="ai" icon="spark" title="Extract invoice fields" sub="AI · vendor, number, amount, due date" />
            <Edge />
            <Node c="app" icon="match" title="Match to purchase order" sub="App · Odoo Purchase" />
            <Edge />
            <Node c="condition" icon="branch" title="Amount over $500?" sub="Condition" />
            <svg className={s.wsplit} viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M200 0 C200 30 100 22 100 52" />
              <path d="M200 0 C200 30 300 22 300 52" />
              <polygon points="95,50 105,50 100,58" />
              <polygon points="295,50 305,50 300,58" />
            </svg>
            <div className={s.wbr}>
              <div className={s.wcol}>
                <small className={s.wlab}>Yes</small>
                <Node c="channel" icon="chat" title="Ask Finance to approve" sub="Channel · Slack" />
              </div>
              <div className={s.wcol}>
                <small className={s.wlab}>No</small>
                <Node c="action" icon="check" title="Auto-approve" sub="Action · logged" />
              </div>
            </div>
            <svg className={s.wsplit} viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M100 0 C100 30 200 22 200 52" />
              <path d="M300 0 C300 30 200 22 200 52" />
              <polygon points="195,50 205,50 200,58" />
            </svg>
            <Node c="app" icon="doc" title="Post bill to Odoo" sub="App · Accounting, vendor bills" />
          </div>
        </div>
      </div>
    </section>
  );
}
