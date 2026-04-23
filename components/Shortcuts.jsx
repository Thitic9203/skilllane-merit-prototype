// Keyboard shortcuts help overlay. Invoked via `?` or `/`.
// A lightweight modal — scrim + centered card with grouped shortcut rows.

const Kbd = ({ children }) => (
  <kbd style={{
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 12, fontWeight: 600,
    minWidth: 22, height: 24,
    padding: '0 6px',
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    background:'var(--surface-muted)',
    border:'1px solid var(--border)',
    borderBottomWidth: 2,
    borderRadius: 6,
    color:'var(--text)',
    lineHeight:1,
  }}>{children}</kbd>
);

const Row = ({ keys, label }) => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, padding:'10px 0', borderBottom:'1px solid var(--border-soft)'}}>
    <span style={{fontSize:14, color:'var(--text)'}}>{label}</span>
    <span style={{display:'flex', gap:6, alignItems:'center', flexShrink:0}}>
      {keys.map((k, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{fontSize:11, color:'var(--text-subtle)'}}>or</span>}
          <Kbd>{k}</Kbd>
        </React.Fragment>
      ))}
    </span>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{marginBottom:20}}>
    <div className="t-label muted" style={{marginBottom:6}}>{title}</div>
    <div>{children}</div>
  </div>
);

const ShortcutsPanel = ({ open, onClose, isAdmin }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:200,
        background:'rgba(9,23,41,0.55)',
        backdropFilter:'blur(4px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding: 20,
        animation:'fadeUp 180ms ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="card"
        style={{
          width:'100%', maxWidth:520,
          maxHeight:'min(80vh, 640px)',
          overflow:'auto',
          padding: 28,
          animation:'fadeUp 260ms cubic-bezier(0.2,0.8,0.2,1) both',
        }}
      >
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:20}}>
          <div>
            <div className="t-label muted" style={{display:'flex', alignItems:'center', gap:6}}>
              <Icon name="sparkles" size={12}/> Keyboard
            </div>
            <h2 className="t-h2" style={{margin:'4px 0 0'}}>Shortcuts</h2>
            <p className="t-body-sm muted" style={{margin:'6px 0 0', maxWidth:360}}>
              Global shortcuts work anywhere in the app, except when you're typing in a field.
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width:34, height:34, borderRadius:10,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'var(--text-muted)',
            border:'1px solid var(--border-soft)',
            background:'var(--surface-muted)',
          }}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        <Section title="Navigate">
          <Row keys={['1']} label="Dashboard"/>
          <Row keys={['2']} label="My Activities"/>
          <Row keys={['3']} label="Rewards"/>
          <Row keys={['4']} label="Leaderboard"/>
          {isAdmin && <Row keys={['5']} label="Approvals"/>}
          {isAdmin && <Row keys={['6']} label="Reports"/>}
        </Section>

        <Section title="Appearance">
          <Row keys={['T']} label="Toggle dark / light theme"/>
          <Row keys={['V']} label="Toggle mobile / desktop preview"/>
          <Row keys={[',']} label="Open design tokens"/>
        </Section>

        <Section title="Help">
          <Row keys={['?', '/']} label="Show / hide this panel"/>
          <Row keys={['Esc']} label="Close any overlay"/>
        </Section>

        <div className="t-caption muted" style={{marginTop:8, paddingTop:14, borderTop:'1px solid var(--border-soft)', lineHeight:1.55}}>
          Tip — shortcuts won't fire while a text field is focused. Click anywhere outside to regain keyboard control.
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ShortcutsPanel });
