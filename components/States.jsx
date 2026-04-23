// Shared State components — Error message + Empty state
// Used across every screen. Visuals: thin icon, concise copy, 1-2 actions.

const StateBase = ({ icon, tone, title, body, actions, compact }) => {
  const toneMap = {
    error: { color: 'var(--error)', bg: 'color-mix(in oklch, var(--error) 12%, transparent)', border: 'color-mix(in oklch, var(--error) 36%, transparent)' },
    empty: { color: 'var(--text-muted)', bg: 'var(--surface-muted)', border: 'var(--border-soft)' },
    info:  { color: 'var(--accent-gold)', bg: 'color-mix(in oklch, var(--accent-gold) 12%, transparent)', border: 'color-mix(in oklch, var(--accent-gold) 34%, transparent)' },
  };
  const t = toneMap[tone] || toneMap.empty;
  return (
    <div className="fade-in" style={{
      display:'flex', flexDirection:'column', alignItems:'center',
      padding: compact ? '40px 24px' : '72px 32px',
      textAlign:'center',
    }}>
      <div style={{
        width: compact ? 48 : 64, height: compact ? 48 : 64,
        borderRadius: compact ? 14 : 18,
        background: t.bg, border: `1px solid ${t.border}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        color: t.color, marginBottom: compact ? 14 : 20,
      }}>
        {icon}
      </div>
      <h3 style={{margin:0, fontSize: compact?16:20, fontWeight:600, letterSpacing:'-0.015em', color:'var(--text)'}}>{title}</h3>
      <p className="t-body muted" style={{margin:'8px 0 0', maxWidth: 420, lineHeight: 1.6, textWrap:'pretty'}}>{body}</p>
      {actions && actions.length > 0 && (
        <div style={{display:'flex', gap:10, marginTop: compact?16:22, flexWrap:'wrap', justifyContent:'center'}}>
          {actions}
        </div>
      )}
    </div>
  );
};

// Error banner (inline, for form/page-level errors)
const ErrorBanner = ({ title, body, onRetry, onDismiss }) => (
  <div role="alert" aria-live="polite" className="fade-in" style={{
    display:'flex', gap:12,
    padding:'14px 16px', borderRadius:12,
    background:'color-mix(in oklch, var(--error) 10%, transparent)',
    border:'1px solid color-mix(in oklch, var(--error) 34%, transparent)',
    marginBottom:20,
  }}>
    <div style={{width:22, height:22, borderRadius:'50%', background:'var(--error)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, flexShrink:0, marginTop:1}}>!</div>
    <div style={{flex:1, minWidth:0}}>
      <div style={{fontSize:14, fontWeight:600, color:'var(--error)'}}>{title}</div>
      {body && <div className="t-body-sm muted" style={{marginTop:3}}>{body}</div>}
    </div>
    {(onRetry || onDismiss) && (
      <div style={{display:'flex', gap:6}}>
        {onRetry && <button onClick={onRetry} style={{fontSize:13, fontWeight:600, color:'var(--error)', padding:'6px 10px', borderRadius:6}}>Retry</button>}
        {onDismiss && <button onClick={onDismiss} aria-label="Dismiss" style={{width:28, height:28, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)'}}><Icon name="x" size={16}/></button>}
      </div>
    )}
  </div>
);

// Full-screen error — wraps content region
const PageError = ({ title, body, onRetry, onHome }) => (
  <StateBase
    tone="error"
    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><circle cx="12" cy="16" r="0.6" fill="currentColor"/></svg>}
    title={title}
    body={body}
    actions={[
      onRetry && <button key="r" className="btn btn-primary" onClick={onRetry}>Try again</button>,
      onHome && <button key="h" className="btn btn-ghost" onClick={onHome}>Go to dashboard</button>,
    ].filter(Boolean)}
  />
);

// Empty state — variants
const EmptyState = ({ kind = 'search', title, body, actions, compact }) => {
  const icons = {
    search:        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>,
    history:       <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
    rewards:       <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="5" rx="1"/><path d="M4 13v8h16v-8"/><path d="M12 8v13"/></svg>,
    feed:          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/></svg>,
    badges:        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,3 19,7 19,17 12,21 5,17 5,7"/></svg>,
    team:          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M15 20c0-2 2-4 5-4"/></svg>,
  };
  return <StateBase tone="empty" icon={icons[kind] || icons.search} title={title} body={body} actions={actions} compact={compact}/>;
};

Object.assign(window, { ErrorBanner, PageError, EmptyState });
