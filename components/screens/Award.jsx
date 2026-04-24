// Admin: Award Points — form with recipient picker
const AwardScreen = ({ data, isMobile, setScreen }) => {
  const toast = useToast();
  const [stateMode, setStateMode] = React.useState('normal');

  // Loading: show skeleton while stateMode === 'loading'
  if (stateMode === 'loading') {
    return (
      <div style={{position:'relative'}}>
        <div style={{position:'absolute', top:16, right:isMobile?16:48, zIndex:5}}>
          <StateModeSwitch value={stateMode} onChange={setStateMode}/>
        </div>
        <SkeletonAward isMobile={isMobile}/>
      </div>
    );
  }

  // Error state
  if (stateMode === 'error') {
    return (
      <div className="fade-in" style={{padding: isMobile?'20px 16px':'40px 48px', maxWidth:1100, margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'flex-end', marginBottom:12}}>
          <StateModeSwitch value={stateMode} onChange={setStateMode}/>
        </div>
        <PageError
          title="Couldn't load your team"
          body="We lost connection while fetching recipients. Check your connection and retry."
          onRetry={() => setStateMode('normal')}
          onHome={() => setScreen('dashboard')}
        />
      </div>
    );
  }

  // Empty state (no recipients configured — e.g. new manager)
  if (stateMode === 'empty') {
    return (
      <div className="fade-in" style={{padding: isMobile?'20px 16px':'40px 48px', maxWidth:1100, margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'flex-end', marginBottom:12}}>
          <StateModeSwitch value={stateMode} onChange={setStateMode}/>
        </div>
        <EmptyState
          kind="team"
          title="No team members yet"
          body="Add people to your reporting line in Settings to start awarding recognition."
          actions={[
            <button key="h" className="btn btn-primary" onClick={() => setStateMode('normal')}>Reload</button>,
            <button key="s" className="btn btn-ghost" onClick={() => setScreen('dashboard')}>Back to dashboard</button>,
          ]}
        />
      </div>
    );
  }

  return <AwardForm data={data} isMobile={isMobile} setScreen={setScreen} toast={toast} stateMode={stateMode} setStateMode={setStateMode}/>;
};

const AwardForm = ({ data, isMobile, setScreen, toast, stateMode, setStateMode }) => {
  const [recipients, setRecipients] = React.useState([data.recipients[0].id]);
  const [amount, setAmount] = React.useState(100);
  const [category, setCategory] = React.useState('Shipped Work');
  const [note, setNote] = React.useState('');
  const [announce, setAnnounce] = React.useState(true);
  const [confirmed, setConfirmed] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const submit = () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setConfirmed(true);
      const names = recipients.length === 1
        ? data.recipients.find(p => p.id === recipients[0]).name
        : `${recipients.length} colleagues`;
      toast.success(
        `${total.toLocaleString()} points awarded`,
        `Sent to ${names}. They have been notified.`,
        { action: { label: 'View team', onClick: () => setScreen('team') } }
      );
    }, 500);
  };

  const toggleRecipient = (id) => {
    setRecipients(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  };

  const total = recipients.length * amount;
  const canSubmit = recipients.length > 0 && amount > 0 && note.trim().length > 0;

  if (confirmed) {
    return (
      <div className="fade-in" style={{padding: isMobile?'20px 16px':'40px 48px', maxWidth: 720, margin: '0 auto'}}>
        <div className="card" style={{padding: 40, textAlign:'center'}}>
          <div style={{
            width:64, height:64, borderRadius:'50%',
            margin:'0 auto 20px',
            background:'color-mix(in oklch, var(--success) 18%, transparent)',
            color:'var(--success)', display:'flex', alignItems:'center', justifyContent:'center',
            animation:'fadeUp 300ms ease-out',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7"/>
            </svg>
          </div>
          <h2 className="t-h2" style={{margin:'0 0 8px'}}>Points awarded</h2>
          <p className="t-body muted" style={{margin:'0 auto 24px', maxWidth:420}}>
            {total.toLocaleString()} points distributed to {recipients.length} {recipients.length===1?'person':'people'}. They will be notified now.
          </p>
          <div style={{display:'flex', gap:10, justifyContent:'center'}}>
            <button className="btn btn-ghost" onClick={() => { setConfirmed(false); setNote(''); setRecipients([]); setAmount(100); }}>Award more</button>
            <button className="btn btn-primary" onClick={() => setScreen('team')}>Go to team dashboard <Icon name="arrow-right" size={14}/></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth: 1100, margin:'0 auto'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16, marginBottom:24, flexWrap:'wrap'}}>
        <div>
          <div className="t-label muted" style={{display:'flex', alignItems:'center', gap:6}}>
            <Icon name="shield" size={12}/> Manager tools
          </div>
          <h1 className="t-h1" style={{margin:'6px 0 0'}}>Award points</h1>
          <p className="t-body muted" style={{maxWidth:560, marginTop:8}}>Recognize work that deserves a meaningful record. Awards appear instantly in the recipient's ledger.</p>
        </div>
        <StateModeSwitch value={stateMode} onChange={setStateMode}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr':'minmax(0,1.3fr) minmax(0,1fr)', gap: 24}}>
        {/* Form */}
        <div className="card" style={{padding: isMobile?20:32}}>
          <Field label="Recipients">
            <div style={{display:'flex', flexDirection:'column', gap:6}}>
              {data.recipients.map(p => {
                const on = recipients.includes(p.id);
                return (
                  <button key={p.id} onClick={()=>toggleRecipient(p.id)} style={{
                    display:'flex', alignItems:'center', gap:12,
                    padding:'10px 12px', borderRadius:10,
                    background: on ? 'color-mix(in oklch, var(--accent-gold) 10%, transparent)' : 'var(--surface-muted)',
                    border: `1px solid ${on ? 'color-mix(in oklch, var(--accent-gold) 40%, transparent)' : 'var(--border-soft)'}`,
                    transition:'all 150ms ease-out',
                  }}>
                    <div style={{
                      width:18, height:18, borderRadius:5,
                      background: on ? 'var(--accent-gold)' : 'transparent',
                      border: `1.5px solid ${on ? 'var(--accent-gold)' : 'var(--border)'}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:'var(--nav-navy)',
                    }}>
                      {on && <Icon name="check" size={12}/>}
                    </div>
                    <Avatar initials={p.initials} size={32} tone="navy"/>
                    <div style={{textAlign:'left', flex:1}}>
                      <div style={{fontSize:14, fontWeight:500}}>{p.name}</div>
                      <div className="t-caption muted">{p.team}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Category">
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              {data.categories.map(c => (
                <button key={c} onClick={()=>setCategory(c)} style={{
                  padding:'8px 14px', borderRadius:8, fontSize:13, fontWeight:500,
                  background: category === c ? 'var(--nav-navy)' : 'var(--surface-muted)',
                  color: category === c ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${category === c ? 'var(--nav-navy)' : 'var(--border-soft)'}`,
                }}>{c}</button>
              ))}
            </div>
          </Field>

          <Field label="Amount per person">
            <div style={{display:'flex', gap:10, alignItems:'center'}}>
              <div style={{display:'flex', gap:6}}>
                {[25, 50, 100, 200, 500].map(v => (
                  <button key={v} onClick={()=>setAmount(v)} style={{
                    padding:'8px 14px', borderRadius:8, fontSize:13, fontWeight:600,
                    background: amount === v ? 'color-mix(in oklch, var(--accent-gold) 18%, transparent)' : 'var(--surface-muted)',
                    color: amount === v ? 'var(--accent-gold)' : 'var(--text-muted)',
                    border: `1px solid ${amount === v ? 'color-mix(in oklch, var(--accent-gold) 40%, transparent)' : 'var(--border-soft)'}`,
                  }}>{v}</button>
                ))}
              </div>
              <div style={{flex:1, display:'flex', alignItems:'center', gap:8}}>
                <span className="t-caption muted">or custom</span>
                <input type="number" value={amount} min={1} onChange={e=>setAmount(+e.target.value||0)} className="input" style={{width:100, padding:'8px 10px'}}/>
              </div>
            </div>
          </Field>

          <Field label="Note" hint="Shared with recipient. Be specific — describe what, why, and its impact.">
            <textarea value={note} onChange={e=>setNote(e.target.value)} rows={4} maxLength={500} className="input" placeholder="Delivered the design system v3 launch on time, with exceptional attention to edge-case handling on dark mode…" style={{resize:'vertical', fontSize:14, lineHeight:1.55}}/>
            <div className="t-caption muted num" style={{marginTop:6, textAlign:'right'}}>{note.length} / 500</div>
          </Field>

          <Field label="Visibility">
            <label style={{display:'flex', gap:10, alignItems:'flex-start', padding:'12px 14px', borderRadius:10, background:'var(--surface-muted)', border:'1px solid var(--border-soft)', cursor:'pointer'}}>
              <input type="checkbox" checked={announce} onChange={e=>setAnnounce(e.target.checked)} style={{marginTop:3}}/>
              <div>
                <div style={{fontSize:14, fontWeight:500}}>Post to the recognition feed</div>
                <div className="t-caption muted" style={{marginTop:2}}>Makes the award visible to the org. Uncheck for private recognition.</div>
              </div>
            </label>
          </Field>
        </div>

        {/* Preview */}
        <div style={{display:'flex', flexDirection:'column', gap: 16, position: isMobile?'static':'sticky', top: 88, alignSelf:'flex-start'}}>
          <div className="card" style={{padding: 24, background:'var(--nav-navy)', color:'#fff'}}>
            <div className="t-label" style={{color:'rgba(255,255,255,0.5)'}}>Total to award</div>
            <div className="num" style={{fontSize: 56, fontWeight:600, letterSpacing:'-0.025em', color:'var(--accent-gold)', lineHeight:1, marginTop:8}}>
              {total.toLocaleString()}
            </div>
            <div style={{display:'flex', gap:12, marginTop:16, fontSize:13, color:'rgba(255,255,255,0.7)'}}>
              <span><span className="num" style={{color:'#fff', fontWeight:600}}>{recipients.length}</span> recipient{recipients.length!==1?'s':''}</span>
              <span>×</span>
              <span className="num" style={{color:'#fff', fontWeight:600}}>{amount.toLocaleString()} pts</span>
            </div>
          </div>

          <div className="card" style={{padding:20}}>
            <div className="t-label muted">Preview</div>
            <div style={{marginTop:12, padding:14, borderRadius:12, background:'var(--surface-muted)', border:'1px solid var(--border-soft)'}}>
              <div style={{display:'flex', alignItems:'center', flexWrap:'wrap', gap:6, fontSize:13}}>
                <strong>You</strong>
                <span className="muted">→</span>
                <strong>{recipients.length === 1 ? data.recipients.find(p=>p.id===recipients[0]).name.split(' ')[0] : `${recipients.length} colleagues`}</strong>
                <span className="chip chip-gold" style={{padding:'3px 9px', fontSize:11}}><CoinGlyph size={11}/>+{amount}</span>
              </div>
              <div className="t-caption muted" style={{marginTop:4}}>{category}</div>
              <p style={{margin:'10px 0 0', fontSize:13.5, lineHeight:1.55, color: note ? 'var(--text)' : 'var(--text-subtle)', fontStyle: note ? 'normal' : 'italic'}}>
                {note || 'Your note will appear here.'}
              </p>
            </div>
          </div>

          <button className="btn btn-primary" onClick={submit} disabled={!canSubmit || submitting} style={{padding:'14px 20px', opacity: canSubmit && !submitting ? 1 : 0.4}}>
            {submitting ? <>Awarding…</> : <>Award {total.toLocaleString()} points <Icon name="arrow-right" size={14}/></>}
          </button>
          <div className="t-caption muted" style={{textAlign:'center', lineHeight:1.5}}>
            Awards are final. They appear in the recipient's ledger immediately and cannot be revoked.
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, hint, children }) => (
  <div style={{marginBottom:24}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10}}>
      <label className="t-label muted">{label}</label>
    </div>
    {children}
    {hint && <div className="t-caption muted" style={{marginTop:6, lineHeight:1.5}}>{hint}</div>}
  </div>
);

Object.assign(window, { AwardScreen });
