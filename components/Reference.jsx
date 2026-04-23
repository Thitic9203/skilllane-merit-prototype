// Design tokens reference panel — slide-out from right edge
const TokensPanel = ({ open, onClose, theme, setTheme }) => {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{
        position:'fixed', inset:0, background:'rgba(11,30,61,0.35)',
        zIndex: 100, backdropFilter:'blur(2px)',
        animation:'fadeUp 200ms ease-out both',
      }}/>
      <aside style={{
        position:'fixed', top:0, right:0, bottom:0, width:'min(420px, 100vw)',
        background:'var(--bg)', color:'var(--text)',
        zIndex: 101, overflowY:'auto',
        boxShadow:'-8px 0 32px rgba(11,30,61,0.18)',
        animation: 'slideIn 220ms ease-out both',
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(16px); opacity: 0; } to { transform: translateX(0); opacity: 1; }}`}</style>
        <div style={{padding:24, borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background:'var(--bg)', zIndex:2}}>
          <div>
            <div className="t-label muted">Reference</div>
            <h2 className="t-h3" style={{margin:'4px 0 0'}}>Design tokens</h2>
          </div>
          <button onClick={onClose} style={{width:36, height:36, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--surface-muted)'}}>
            <Icon name="x" size={18}/>
          </button>
        </div>

        <div style={{padding:'20px 24px', display:'flex', flexDirection:'column', gap:28}}>
          <section>
            <div className="t-label muted" style={{marginBottom:12}}>Mode</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
              {['light','dark'].map(t => (
                <button key={t} onClick={()=>setTheme(t)} style={{
                  padding:14, borderRadius:12,
                  background: theme===t ? 'var(--surface)' : 'transparent',
                  border: `1px solid ${theme===t ? 'var(--accent-gold)' : 'var(--border)'}`,
                  display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                  textTransform:'capitalize', fontSize:13, fontWeight:500,
                }}>
                  <Icon name={t==='dark'?'moon':'sun'} size={18}/>
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="t-label muted" style={{marginBottom:12}}>Color · {theme}</div>
            <div style={{display:'grid', gap:8}}>
              {(theme==='light' ? [
                ['Page bg',       '#F0F3F7'],
                ['Surface',       '#FFFFFF'],
                ['Nav (anchor)',  '#0B1E3D'],
                ['Text',          '#0B1E3D'],
                ['Text muted',    '#4A5568'],
                ['Border',        '#D6DBE4'],
              ] : [
                ['Page bg',       '#060E1C'],
                ['Surface',       '#13233F'],
                ['Surface muted', '#0E1A30'],
                ['Nav (anchor)',  '#0B1E3D'],
                ['Text',          '#EEF1F6'],
                ['Text muted',    '#A5B8CE'],
                ['Border',        '#2B426B'],
                ['Input bg',      '#0F1E38'],
              ]).map(([l,h]) => <Swatch key={l} label={l} hex={h}/>)}
              <div style={{height:8}}/>
              <div className="t-label muted" style={{marginTop:8, marginBottom:4}}>Shared accents</div>
              <Swatch label="Accent gold"  hex="#C8A96E"/>
              <Swatch label="Success"      hex="#3DAA72"/>
              <Swatch label="Error"        hex="#E05252"/>
            </div>
          </section>

          <section>
            <div className="t-label muted" style={{marginBottom:12}}>Type</div>
            <div style={{display:'flex', flexDirection:'column', gap:14}}>
              <TypeRow label="Display" size="64" weight="700" sample="4,820"/>
              <TypeRow label="Heading" size="36" weight="600" sample="Recognition"/>
              <TypeRow label="Body"    size="15" weight="400" sample="Spend earned merit on things that matter."/>
              <TypeRow label="Label"   size="12" weight="500" letter="+0.06em" transform="uppercase" sample="Member since"/>
            </div>
          </section>

          <section>
            <div className="t-label muted" style={{marginBottom:12}}>Spacing &amp; radius</div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8}}>
              {[4, 8, 12, 16, 24, 32].map(v => (
                <div key={v} style={{textAlign:'center'}}>
                  <div style={{height: v, background:'var(--accent-gold)', borderRadius: 4, marginBottom:6}}/>
                  <div className="t-caption muted num">{v}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex', gap:10, marginTop:16}}>
              {[8, 12, 16, 20, 24].map(r => (
                <div key={r} style={{flex:1, textAlign:'center'}}>
                  <div style={{aspectRatio:'1', background:'var(--surface)', border:'1px solid var(--border)', borderRadius: r, marginBottom:6}}/>
                  <div className="t-caption muted num">r{r}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
};

const Swatch = ({ label, hex }) => (
  <div style={{display:'flex', alignItems:'center', gap:12, padding:'8px 12px', borderRadius:8, background:'var(--surface)', border:'1px solid var(--border-soft)'}}>
    <div style={{width:24, height:24, borderRadius:6, background: hex, boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.08)'}}/>
    <div style={{flex:1, fontSize:13, fontWeight:500}}>{label}</div>
    <div className="num t-caption muted">{hex}</div>
  </div>
);

const TypeRow = ({ label, size, weight, sample, letter, transform }) => (
  <div style={{borderBottom:'1px solid var(--border-soft)', paddingBottom:12}}>
    <div className="t-caption muted" style={{marginBottom:6, display:'flex', justifyContent:'space-between'}}>
      <span>{label}</span>
      <span className="num">{size}px · {weight}</span>
    </div>
    <div style={{fontSize: `${size}px`, fontWeight: weight, letterSpacing: letter || '-0.01em', textTransform: transform || 'none', lineHeight: 1.1}}>
      {sample}
    </div>
  </div>
);

// Viewport switcher — lets user preview mobile in an iPhone-like frame
const ViewportSwitcher = ({ vp, setVp }) => (
  <div style={{display:'flex', gap:2, background:'rgba(255,255,255,0.06)', borderRadius:8, padding:2}}>
    {[
      {id:'auto',    icon:'shield', label:'Auto'},
      {id:'desktop', icon:'monitor', label:'Desktop'},
      {id:'mobile',  icon:'smartphone', label:'Mobile'},
    ].map(o => {
      const active = vp === o.id;
      return (
        <button key={o.id} onClick={()=>setVp(o.id)} title={o.label} style={{
          padding:'6px 10px', borderRadius:6,
          display:'flex', alignItems:'center', gap:6,
          fontSize:12, fontWeight:500,
          background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
          color: active ? '#fff' : 'rgba(255,255,255,0.55)',
          transition:'all 150ms ease-out',
        }}>
          <Icon name={o.icon} size={14}/>
          <span>{o.label}</span>
        </button>
      );
    })}
  </div>
);

Object.assign(window, { TokensPanel, ViewportSwitcher });
