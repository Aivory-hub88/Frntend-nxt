/* eslint-disable @next/next/no-img-element */
import s from './landing.module.css';

type Member = { name: string; avatar?: string; agent?: string };

const MEMBERS: Member[] = [
  { name: 'Ben', avatar: 'ben' },
  { name: 'Rachel', avatar: 'rachel' },
  { name: 'Lex', agent: 'leads_qualifier' },
  { name: 'Leah', avatar: 'leah' },
  { name: 'Lee', avatar: 'lee' },
  { name: 'Aira', agent: 'chief_of_staff' },
  { name: 'Oliver', avatar: 'oliver' },
  { name: 'Finn', agent: 'finance_invoice_ops' },
  { name: 'Ryan', avatar: 'ryan' },
  { name: 'Kevin', avatar: 'kevin' },
  { name: 'Daniel', avatar: 'daniel' },
  { name: 'Sam', avatar: 'sam' },
];

const avatar = (slug: string) => `/landing/avatars/${slug}.webp`;

// Same portraits and names as the user dashboard roster (lib/agentRoster.generated.ts):
// Lex = leads_qualifier, Aira = chief_of_staff, Finn = finance_invoice_ops.
function AgentAvatar({ type }: { type: string }) {
  return <img className={s.agentPic} src={`/landing/agents/${type}.svg`} alt="" />;
}

export default function WorkspaceSection() {
  return (
    <section id="workspace" className={`${s.band} ${s.light}`}>
      <div className={s.wrap}>
        <div className={s.head}>
          <span className={s.eyebrow}>Workspace</span>
          <h2 className={s.h2}>
            One room for people and agents
            <br />
            <span className={s.dim}>Mention either one, the work moves.</span>
          </h2>
        </div>

        <div className={s.wsh} role="img" aria-label="Workspace: where teams and AI agents work together, literally">
          <div className={s.wshIn}>
            <i className={`${s.wshGlow} ${s.wg1}`} />
            <i className={`${s.wshGlow} ${s.wg2}`} />
            <img className={s.fbBanner} src="/landing/workspace-banner.webp" alt="" width={2400} height={742} />
            <img className={s.wshIll} src="/landing/workspace-illustrated.webp" alt="" width={900} height={486} />
            <img className={s.wshReal} src="/landing/workspace-people.webp" alt="" width={900} height={469} />
          </div>
        </div>

        <div className={s.stage}>
          <div className={s.roster} aria-label="Workspace members">
            {MEMBERS.map((m) => (
              <span key={m.name} className={`${s.person} ${m.agent ? s.agent : ''}`}>
                {m.name}
                {m.agent ? <AgentAvatar type={m.agent} /> : <img src={avatar(m.avatar as string)} alt="" />}
              </span>
            ))}
          </div>
          <div className={s.chat}>
            <div className={s.msg}>
              <span className={s.who}>Rachel<img src={avatar('rachel')} alt="" /></span>
              <p>
                According to the cutover plan PDF, when do we freeze the old CRM, who owns the cutover, and how long
                is the rollback window? <span className={s.mention}>@Le</span>
              </p>
            </div>
            <div className={s.popup} role="listbox" aria-label="Mention people or agent">
              <small>Mention people or agent</small>
              <div className={`${s.opt} ${s.optOn}`} role="option" aria-selected="true">
                <AgentAvatar type="leads_qualifier" />Lex <span className={s.tagAg}>Agent</span><em>Insert</em>
              </div>
              <div className={s.opt} role="option" aria-selected="false"><img src={avatar('leah')} alt="" />Leah</div>
              <div className={s.opt} role="option" aria-selected="false"><img src={avatar('lee')} alt="" />Lee</div>
            </div>
          </div>
        </div>

        <div className={s.feats}>
          <div className={s.feat}>
            <span className={s.featIc}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-4 8" /></svg>
            </span>
            <p>Tag, alert and assign tasks to team members and agents.</p>
          </div>
          <div className={s.feat}>
            <span className={s.featIc}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></svg>
            </span>
            <p>Start discussions and resolve issues in the workspace itself.</p>
          </div>
          <div className={s.feat}>
            <span className={s.featIc}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3c5 0 9 3.6 9 8s-4 8-9 8c-1.2 0-2.3-.2-3.4-.5L4 20l1.3-3.6C3.9 15 3 13.1 3 11c0-4.4 4-8 9-8z" /></svg>
            </span>
            <p>Increase visibility and keep all work in one place.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
