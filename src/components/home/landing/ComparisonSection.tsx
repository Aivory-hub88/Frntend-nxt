import s from './landing.module.css';

type Status = 'yes' | 'no' | 'warn';

// Same capability matrix as the previous EnterpriseComparisonSection.
const ROWS: Array<{ capability: string; values: [Status, Status, Status, Status] }> = [
  { capability: 'Business Understanding', values: ['no', 'yes', 'warn', 'yes'] },
  { capability: 'AI Deployment', values: ['warn', 'no', 'yes', 'yes'] },
  { capability: 'Workflow Design', values: ['no', 'yes', 'warn', 'yes'] },
  { capability: 'Continuous Platform', values: ['no', 'no', 'yes', 'yes'] },
  { capability: 'Executive Visibility', values: ['no', 'warn', 'warn', 'yes'] },
];

const COLUMNS = ['AI Chat', 'Consulting', 'Automation', 'Aivory'];

const LABEL: Record<Status, string> = { yes: 'Yes', warn: 'Partly', no: 'No' };
const PATH: Record<Status, string> = {
  yes: 'M5 13l4 4L19 7',
  warn: 'M12 8v5M12 16.5h.01',
  no: 'M6 18L18 6M6 6l12 12',
};
const COLOR: Record<Status, string> = { yes: '#9fe3c4', warn: '#f2c46b', no: '#5f7882' };

function Mark({ status }: { status: Status }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: COLOR[status] }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={PATH[status]} />
      </svg>
      <span style={{ fontSize: 13 }}>{LABEL[status]}</span>
    </span>
  );
}

export default function ComparisonSection() {
  return (
    <section id="comparison" className={`${s.band} ${s.dark}`}>
      <div className={s.wrap}>
        <div className={s.head}>
          <span className={s.eyebrow}>Why Aivory</span>
          <h2 className={s.h2}>
            One platform instead of
            <br />
            <span className={s.dim}>chat, consultants and scripts</span>
          </h2>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">Capabilities</th>
                {COLUMNS.map((c, i) => (
                  <th key={c} scope="col" className={i === 3 ? s.me : undefined}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.capability}>
                  <th scope="row" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 15, fontWeight: 400, color: 'var(--snow)' }}>
                    {row.capability}
                  </th>
                  {row.values.map((v, i) => (
                    <td key={COLUMNS[i]} className={i === 3 ? s.me : undefined}><Mark status={v} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
