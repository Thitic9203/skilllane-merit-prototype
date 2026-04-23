// Shared search input — surfaces search term to drive empty states
const ScreenHeader = ({ eyebrow, title, desc, right, searchValue, onSearch, searchPlaceholder, stateMode, onStateModeChange, supportsError = true }) => (
  <>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'end', flexWrap:'wrap', gap:16, marginBottom: 20}}>
      <div>
        <div className="t-label muted">{eyebrow}</div>
        <h1 className="t-h1" style={{margin:'6px 0 0'}}>{title}</h1>
        {desc && <p className="t-body muted" style={{maxWidth:560, marginTop:8}}>{desc}</p>}
      </div>
      {right}
    </div>
    {(onSearch || onStateModeChange) && (
      <div className="card" style={{padding:'10px 14px', marginBottom:16, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'}}>
        {onSearch && (
          <div style={{display:'flex', alignItems:'center', gap:10, flex:1, minWidth:200}}>
            <Icon name="search" size={16} className="muted"/>
            <input value={searchValue} onChange={e=>onSearch(e.target.value)} placeholder={searchPlaceholder} style={{flex:1, border:'none', outline:'none', background:'transparent', color:'var(--text)', fontSize:14, padding:'6px 0'}}/>
            {searchValue && <button onClick={()=>onSearch('')} className="muted" style={{fontSize:12, padding:'2px 8px', borderRadius:6}}>Clear</button>}
          </div>
        )}
        {onStateModeChange && (
          <StateModeSwitch value={stateMode} onChange={onStateModeChange} supportsError={supportsError}/>
        )}
      </div>
    )}
  </>
);

// Demo switcher — lets reviewers preview empty/error states
const StateModeSwitch = ({ value, onChange, supportsError = true }) => {
  const options = [
    { v: 'normal', l: 'Normal' },
    { v: 'loading', l: 'Loading' },
    { v: 'empty',  l: 'Empty state' },
  ];
  if (supportsError) options.push({ v: 'error', l: 'Error state' });
  return (
    <div style={{display:'flex', alignItems:'center', gap:8}}>
      <span className="t-caption muted" style={{letterSpacing:'0.04em', textTransform:'uppercase', fontSize:11}}>Preview</span>
      <div style={{display:'flex', gap:2, padding:2, background:'var(--surface-muted)', borderRadius:8, border:'1px solid var(--border-soft)'}}>
        {options.map(o => (
          <button key={o.v} onClick={()=>onChange(o.v)} style={{
            padding:'5px 10px', fontSize:12, fontWeight:500,
            borderRadius:6,
            background: value===o.v ? 'var(--surface)' : 'transparent',
            color: value===o.v ? 'var(--text)' : 'var(--text-muted)',
            boxShadow: value===o.v ? '0 1px 2px rgba(11,30,61,0.06)' : 'none',
          }}>{o.l}</button>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { ScreenHeader, StateModeSwitch });
