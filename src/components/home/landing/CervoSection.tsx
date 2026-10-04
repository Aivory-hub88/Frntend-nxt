/* eslint-disable @next/next/no-img-element */
import s from './landing.module.css';

const CERVO_ICON = '/landing/cervo-icon.svg';

// 7 x 5 grid; the MCP tile sits mid-grid and is the lit one. `tint` colours
// icons whose SVGs are white-only (drawn for dark backgrounds).
const APP_ICONS: Array<{ name: string; src: string; wide?: boolean; tint?: string }> = [
  { name: 'Aivory Mail', src: 'aivory-mail.svg' },
  { name: 'Slack', src: 'slack.svg' },
  { name: 'Gmail', src: 'gmail.svg' },
  { name: 'Odoo', src: 'odoo.svg', wide: true },
  { name: 'HubSpot', src: 'hubspot-svgrepo-com.svg', tint: '#ff7a59' },
  { name: 'Notion', src: 'notion.svg' },
  { name: 'GitHub', src: 'github.svg' },
  { name: 'Salesforce', src: 'salesforce.svg' },
  { name: 'Telegram', src: 'telegram.svg' },
  { name: 'WhatsApp', src: 'whatsapp.svg' },
  { name: 'Discord', src: 'discord.svg' },
  { name: 'Jira', src: 'jira.svg' },
  { name: 'Linear', src: 'linear.svg' },
  { name: 'Microsoft Teams', src: 'microsoft-teams.svg' },
  { name: 'Trello', src: 'trello.svg' },
  { name: 'Google Drive', src: 'google-drive.svg' },
  { name: 'Zendesk', src: 'zendesk.svg', tint: '#03363d' },
  { name: 'MCP', src: 'MCP' },
  { name: 'Outlook', src: 'outlook.svg' },
  { name: 'Shopify', src: 'shopify.svg' },
  { name: 'Dropbox', src: 'dropbox.svg' },
  { name: 'OpenAI', src: 'openai.svg', tint: '#000000' },
  { name: 'Claude', src: 'claude.svg' },
  { name: 'Gemini', src: 'gemini.svg' },
  { name: 'Airtable', src: 'airtable.svg' },
  { name: 'Intercom', src: 'intercom.svg' },
  { name: 'Stripe', src: 'stripe-v2-svgrepo-com.svg', tint: '#635bff' },
  { name: 'Zoom', src: 'zoom.svg' },
  { name: 'Google Calendar', src: 'google-calendar.svg' },
  { name: 'Mailchimp', src: 'mailchimp.svg' },
  { name: 'Twilio', src: 'twilio.svg' },
  { name: 'SendGrid', src: 'sendgrid.svg' },
  { name: 'AWS', src: 'aws.svg' },
  { name: 'Amazon S3', src: 'aws-s3.svg' },
  { name: 'Tencent Cloud', src: 'tencent-cloud.svg' },
];

const ROLES: Array<{ label: string; d: string; color: string }> = [
  { label: 'Finance', d: 'M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 2.6 4.5 3 4.5 1.3 4.5 3-2 3-4.5 3-4.5-1.3-4.5-3', color: '#34c759' },
  { label: 'Sales', d: 'M4 19l5-6 4 3 7-9M14 7h6v6', color: '#007aff' },
  { label: 'Operations', d: 'M12 9a3 3 0 100 6 3 3 0 000-6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1', color: '#ff9500' },
  { label: 'Support', d: 'M4 13a8 8 0 0116 0v4a2 2 0 01-2 2h-1v-6h3M4 13v4a2 2 0 002 2h1v-6H4', color: '#30b0c7' },
  { label: 'People', d: 'M9 5a3 3 0 100 6 3 3 0 000-6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 11a3 3 0 100-6M21 20c0-2.6-1.6-4.8-4-5.6', color: '#af52de' },
  { label: 'Procurement', d: 'M3 7h18v13H3zM8 7V4h8v3M3 12h18', color: '#a2845e' },
  { label: 'Legal', d: 'M12 3v18M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z', color: '#5856d6' },
  { label: 'IT', d: 'M5 4h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zM8 20h8M12 16v4', color: '#8e8e93' },
  { label: 'Analytics', d: 'M5 20V10M12 20V4M19 20v-7', color: '#ff2d55' },
];

function Line({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function CervoMark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <img src={CERVO_ICON} alt="" />
    </span>
  );
}

function Task({ src, badge, tone, text, result, working }: {
  src: string; badge: string; tone: 'ok' | 'blue' | 'amb'; text: string; result: string; working?: boolean;
}) {
  return (
    <div className={s.task}>
      <div className={s.th}>
        <span className={s.thSrc}>{src}</span>
        <span className={`${s.bdg} ${s[tone]}`}>{badge}</span>
      </div>
      <p>{text}</p>
      <div className={`${s.res} ${working ? s.resDots : ''}`}>
        {working ? (<><i /><i /><i /></>) : <span aria-hidden="true">→</span>}
        {result}
      </div>
    </div>
  );
}

export default function CervoSection() {
  return (
    <section id="cervo" className={`${s.band} ${s.light}`}>
      <div className={s.wrap}>
        <div className={s.head}>
          <span className={s.eyebrow}><span className={s.eyebrowLogo} role="img" aria-label="Aivory" />Cervo</span>
          <h2 className={s.h2}>
            Agents that work like teammates
            <br />
            <span className={s.dim}>not like a chat window</span>
          </h2>
        </div>

        <div
          className={`${s.fb} ${s.fbCervo}`}
          role="img"
          aria-label="Aivory Cervo: a team of AI agents, each with its own brain, memory and computer"
        >
          <i className={`${s.fbGlow} ${s.g1}`} />
          <i className={`${s.fbGlow} ${s.g2}`} />
          <i className={`${s.fbGlow} ${s.g3}`} />
          <img className={s.fbBanner} src="/landing/cervo-banner.webp" alt="" width={2400} height={742} />
          <img className={s.fbPeople} src="/landing/cervo-team.webp" alt="" width={1400} height={368} />
        </div>

        <div className={s.caps} aria-label="Connectivity">
          <div className={s.cap}>
            <span>30+ Apps Integrations</span>
            <span className={s.chip}>
              Integrations
              <span className={s.dots} aria-hidden="true">
                <i style={{ background: '#ea4335' }} /><i style={{ background: '#4285f4' }} />
                <i style={{ background: '#34a853' }} /><i style={{ background: '#ff7a59' }} />
              </span>
            </span>
          </div>
          <div className={s.cap}>
            <span>MCP Connection</span>
            <span className={s.chip}><img src="/landing/mcp.svg" alt="" />Model Context Protocol</span>
          </div>
          <div className={s.cap}>
            <span>A2A Protocol</span>
            <span className={s.chip}>Agent2Agent</span>
          </div>
        </div>

        <div className={s.ig} aria-label="What every Cervo agent has">
          <article className={s.igc}>
            <h4>Memory &amp; Context</h4>
            <p className={s.igd}>Each agent remembers customers, vendors and past decisions, then applies them to the next task without being told twice.</p>
            <div className={`${s.igp} ${s.chatp}`}>
              <div className={s.chatH}>
                <CervoMark className={s.cvm} />
                <div><b>Finance agent</b><small>Memory</small></div>
                <span className={s.pips} aria-hidden="true"><i /><i /><i /></span>
              </div>
              <div className={s.chatB}>
                <div className={`${s.bub} ${s.bubMe}`}>Send Acme Ltd their March invoice</div>
                <div className={`${s.bub} ${s.bubAg}`}>
                  <span className={s.agL}><i />Aivory agent</span>
                  Sent INV-0412 in GBP with net 30 terms, as Acme Ltd prefers. PO number attached.
                </div>
              </div>
            </div>
          </article>

          <article className={s.igc}>
            <h4>30+ Apps &amp; Any MCP</h4>
            <p className={s.igd}>Agents read and write in the tools your teams already use. Plug in any MCP server and it becomes a new skill.</p>
            <div className={`${s.igp} ${s.icons}`}>
              {APP_ICONS.map((app) =>
                app.src === 'MCP' ? (
                  <span key={app.name} className={`${s.icoT} ${s.icoHot}`}><img src="/landing/mcp.svg" alt="MCP" /></span>
                ) : (
                  <span key={app.name} className={`${s.icoT} ${app.wide ? s.icoWide : ''}`}>
                    {app.tint ? (
                      <span
                        className={s.icoTint}
                        role="img"
                        aria-label={app.name}
                        style={{
                          backgroundColor: app.tint,
                          WebkitMaskImage: `url(/integrations/icons/${app.src})`,
                          maskImage: `url(/integrations/icons/${app.src})`,
                        }}
                      />
                    ) : (
                      <img src={`/integrations/icons/${app.src}`} alt={app.name} />
                    )}
                  </span>
                ),
              )}
            </div>
          </article>

          <article className={s.igc}>
            <h4>A Brain for Every Role</h4>
            <p className={s.igd}>Give each agent the reasoning model and toolkit its role needs. Finance thinks like finance, sales like sales.</p>
            <div className={`${s.igp} ${s.roles}`}>
              {ROLES.map((r) => (
                <div key={r.label} className={s.role}><span className={s.roleIc} style={{ background: r.color }}><Line d={r.d} /></span><span>{r.label}</span></div>
              ))}
            </div>
          </article>

          <article className={s.igc}>
            <h4>Its Own Computer</h4>
            <p className={s.igd}>Every agent works in an isolated workspace with a browser and files, so it finishes the task instead of describing it.</p>
            <div className={`${s.igp} ${s.agentp}`}>
              <div className={s.st}><i />Active · Browser · Files · Sandbox</div>
              <div className={s.flow}>
                <span className={s.bx}><Line d="M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z" /></span>
                <span className={s.ln} />
                <span className={s.bx}><Line d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.6L19 9.4V19a2 2 0 01-2 2z" /></span>
                <span className={s.ln} />
                <span className={s.bx}><img src="/integrations/icons/google-drive.svg" alt="Google Drive" /></span>
                <span className={`${s.bdg} ${s.blue} ${s.push}`}>Processing</span>
              </div>
              <Task src="Odoo · Aged receivables" badge="Processing" tone="blue" text='"Export overdue invoices for March."' result="Opening browser · Filtering 214 rows" working />
              <Task src="Sheets · Cash forecast" badge="Synced" tone="ok" text='"Update the 13-week forecast."' result="Forecast refreshed. #finance notified." />
            </div>
          </article>

          <article className={s.igc}>
            <h4>Agent2Agent Handoff</h4>
            <p className={s.igd}>Agents pass work to each other, and to agents outside Aivory, with the full context attached.</p>
            <div className={`${s.igp} ${s.agentp}`}>
              <div className={s.st}><i />Active · A2A · Shared context</div>
              <div className={s.flow}>
                <CervoMark className={`${s.bx} ${s.bxCervo}`} /><small className={s.fl}>Sales</small>
                <span className={s.arr}><Line d="M14 5l7 7-7 7M21 12H3" /></span>
                <CervoMark className={`${s.bx} ${s.bxCervo}`} /><small className={s.fl}>Finance</small>
                <span className={`${s.bdg} ${s.ok} ${s.push}`}>Handed off</span>
              </div>
              <Task src="Sales → Finance" badge="Handed off" tone="ok" text='"Deal closed: Acme Ltd, 12 seats."' result="Invoice INV-0412 drafted with deal terms." />
              <Task src="Support → Operations" badge="Processing" tone="blue" text='"Replacement unit for order #9042."' result="Checking stock · Booking courier" working />
            </div>
          </article>

          <article className={s.igc}>
            <h4>Governed by Approvals</h4>
            <p className={s.igd}>Agents ask before they act on anything that matters. Approve or deny from the console or straight from Slack.</p>
            <div className={`${s.igp} ${s.agentp}`}>
              <div className={s.st}><i />Active · Approvals · Audit log</div>
              <div className={s.flow}>
                <span className={`${s.tg} ${s.tgOn}`}>Policy</span>
                <span className={`${s.tg} ${s.tgOn}`}>Limit</span>
                <span className={`${s.tg} ${s.tgOn}`}>Approver</span>
                <span className={s.tg}>Audit</span>
              </div>
              <Task src="Finance · Refund $640" badge="Pending" tone="amb" text='"Refund order #9042 for Acme Ltd."' result="Waiting for Rachel in Slack." />
              <Task src="Operations · PO $2,400" badge="Approved" tone="ok" text='"Restock 40 units from Northwind Logistics."' result="Approved by Ben. Logged to audit trail." />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
