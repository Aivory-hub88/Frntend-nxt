/* eslint-disable @next/next/no-img-element */
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
    <section id="workflow-builder" className={`${s.band} ${s.light}`}>
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
          {/* Same look as the Aivory Copilot panel in the user dashboard
              (components/workflow/CopilotTogglePanel.tsx). Illustration only. */}
          <div className={s.cop} aria-label="Aivory Copilot conversation">
            <div className={s.copH}>
              <img src="/landing/aivory-logo-2026.svg" alt="Aivory" className={s.copLogo} />
              <span className={s.copIcons} aria-hidden="true">
                <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
              </span>
            </div>
            <div className={s.copBody}>
              <div className={s.copUser}>
                When an invoice email lands in Gmail, read the PDF and match it to the purchase order in Odoo. If the
                amount is over $500, ask Finance to approve in Slack. Then post the bill to Odoo.
              </div>
              <div className={s.copAi}>
                <img src="/landing/aivory-avatar.svg" alt="" className={s.copAvatar} />
                <div>
                  <p>Here&apos;s the workflow. It watches the Finance inbox, extracts the invoice fields and matches them to the PO in Odoo.</p>
                  <p>Anything over <b>$500</b> goes to Finance in Slack for approval; the rest is approved and logged. Both paths post the vendor bill to Odoo.</p>
                </div>
              </div>
            </div>
            <div className={s.copApply}>
              <div>
                <b>Workflow ready — 6 steps</b>
                <small>Validated. Setup items: 2</small>
              </div>
              <span className={s.copApplyBtn} aria-hidden="true">Apply to canvas</span>
            </div>
            <div className={s.copInputWrap}>
              <div className={s.copInput}>
                <span className={s.copPlaceholder}>Enter an idea or app name to get started</span>
                <svg className={s.copClip} viewBox="0 0 24 24" aria-hidden="true"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                <span className={s.copSend} aria-hidden="true">
                  <svg viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
                </span>
              </div>
            </div>
            <div className={s.copGrip} aria-hidden="true"><i /></div>
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
