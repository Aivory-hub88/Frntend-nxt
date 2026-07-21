export default function BastionBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Always-on, very subtle base wash */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(55% 50% at 50% 40%, rgba(90,124,184,0.16) 0%, rgba(90,124,184,0.06) 60%, transparent 100%)',
        }}
      />
      {/* Central bloom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 42%, rgba(60,52,140,0.35) 0%, rgba(24,22,64,0.22) 38%, rgba(6,6,16,0.05) 62%, rgba(0,0,0,0) 80%)',
        }}
      />
      {/* Soft indigo/blue accents */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(40% 40% at 30% 55%, rgba(38,30,110,0.28) 0%, rgba(0,0,0,0) 70%), radial-gradient(45% 45% at 72% 48%, rgba(30,42,120,0.26) 0%, rgba(0,0,0,0) 70%)',
        }}
      />
    </div>
  );
}
