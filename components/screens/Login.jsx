// Login — Google sign-in, restricted to @skilllane.com
// Desktop: split navy panel + form. Mobile: full navy.
const GoogleG = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{flexShrink:0}}>
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8a12 12 0 110-24c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.2 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.2 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3c-2 1.4-4.5 2.3-7.4 2.3-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 01-4 5.4l6.3 5.3C41 34.3 44 29.6 44 24c0-1.3-.1-2.6-.4-3.9z"/>
  </svg>
);

const LoginScreen = ({ onSignIn, theme }) => {
  const [phase, setPhase] = React.useState('idle'); // idle | loading | error
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState(null);

  const ACCOUNTS = [
    { email: 'thitichaya.c@skilllane.com', ok: true,  reason: null },
    { email: 'somsak.c@skilllane.com',     ok: true,  reason: null },
    { email: 'guest@gmail.com',            ok: false, reason: 'domain' },
    { email: 'contractor@outlook.com',     ok: false, reason: 'domain' },
    { email: 'deactivated@skilllane.com',  ok: false, reason: 'deactivated' },
  ];

  const attempt = (mail) => {
    setEmail(mail);
    setError(null);
    setPhase('loading');
    setTimeout(() => {
      const hit = ACCOUNTS.find(a => a.email === mail);
      // Default behavior: if email matches @skilllane.com and isn't a known-bad account, succeed.
      const domainOk = /@skilllane\.com$/i.test(mail);
      if (hit && !hit.ok) {
        setPhase('error');
        setError(hit.reason === 'deactivated'
          ? { title: 'Account deactivated', body: 'This SkillLane account is no longer active. Contact People Ops to restore access.' }
          : { title: 'Unauthorized email domain', body: 'SkillLane Merit is available to @skilllane.com accounts only. Sign in with your work email.' }
        );
        return;
      }
      if (!domainOk) {
        setPhase('error');
        setError({ title: 'Unauthorized email domain', body: 'SkillLane Merit is available to @skilllane.com accounts only. Sign in with your work email.' });
        return;
      }
      onSignIn();
    }, 900);
  };

  const formPanel = (
    <div style={{width:'100%', maxWidth: 400}}>
      <div className="t-label muted" style={{marginBottom:12}}>Sign in</div>
      <h2 className="t-h1" style={{margin:'0 0 8px'}}>Welcome back.</h2>
      <p className="t-body muted" style={{margin:'0 0 28px'}}>
        SkillLane Merit is restricted to <strong style={{color:'var(--text)'}}>@skilllane.com</strong> accounts.
      </p>

      {/* Error banner */}
      <div style={{
        maxHeight: error ? 200 : 0, overflow:'hidden',
        transition:'max-height 250ms ease-out, margin 250ms ease-out',
        marginBottom: error ? 20 : 0,
      }}>
        {error && (
          <div role="alert" aria-live="polite" style={{
            padding:'14px 16px', borderRadius:12,
            background:'color-mix(in oklch, var(--error) 10%, transparent)',
            border:'1px solid color-mix(in oklch, var(--error) 35%, transparent)',
            display:'flex', gap:12, alignItems:'flex-start',
          }}>
            <div style={{width:22, height:22, borderRadius:'50%', background:'var(--error)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1, fontWeight:700, fontSize:13}}>!</div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:14, fontWeight:600, color:'var(--error)'}}>{error?.title}</div>
              <div className="t-body-sm muted" style={{marginTop:3}}>{error?.body}</div>
            </div>
          </div>
        )}
      </div>

      {/* Google button */}
      <button
        onClick={() => attempt(email || 'thitichaya.c@skilllane.com')}
        disabled={phase === 'loading'}
        style={{
          width:'100%', padding:'14px 20px',
          borderRadius:10,
          background:'#fff', color:'#1f1f1f',
          border:'1px solid #D6DBE4',
          fontSize:14, fontWeight:600,
          display:'flex', alignItems:'center', justifyContent:'center', gap:12,
          transition:'transform 200ms ease-out, box-shadow 200ms ease-out',
          opacity: phase==='loading' ? 0.7 : 1,
          cursor: phase==='loading' ? 'progress' : 'pointer',
        }}
        onMouseEnter={e=>{ if(phase!=='loading'){ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow-card-hover)'; }}}
        onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
      >
        {phase === 'loading'
          ? <><Spinner/> Signing in…</>
          : <><GoogleG size={18}/> Continue with Google</>}
      </button>

      <div style={{margin:'18px 0 10px'}} className="t-caption muted">Try a test account:</div>
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        {ACCOUNTS.map(a => (
          <button key={a.email} onClick={()=>attempt(a.email)} disabled={phase==='loading'} style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'10px 12px', borderRadius:8,
            background:'var(--surface-muted)',
            border:'1px solid var(--border-soft)',
            fontSize:13, textAlign:'left',
            color: a.ok ? 'var(--text)' : 'var(--text-muted)',
          }}>
            <span style={{
              width:8, height:8, borderRadius:'50%',
              background: a.ok ? 'var(--success)' : 'var(--error)',
              flexShrink:0,
            }}/>
            <span className="num" style={{flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{a.email}</span>
            <span className="t-caption muted">{a.ok ? 'authorized' : a.reason === 'deactivated' ? 'deactivated' : 'wrong domain'}</span>
          </button>
        ))}
      </div>

      <p className="t-caption muted" style={{marginTop:24, lineHeight:1.6}}>
        Access is limited to active SkillLane employees. Managed under People Handbook §7.
      </p>
    </div>
  );

  return (
    <div style={{minHeight:'100%', display:'grid', gridTemplateColumns:'1.05fr 1fr', background:'var(--bg)'}}>
      <div style={{background:'var(--nav-navy)', color:'#fff', padding:'56px 64px', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden'}}>
        <Brand/>
        <svg style={{position:'absolute', right:-80, top:100, opacity:0.32}} width="520" height="520" viewBox="0 0 520 520" fill="none">
          <circle cx="260" cy="260" r="240" stroke="var(--accent-gold)" strokeWidth="0.6"/>
          <circle cx="260" cy="260" r="180" stroke="var(--accent-gold)" strokeWidth="0.6"/>
          <circle cx="260" cy="260" r="120" stroke="var(--accent-gold)" strokeWidth="0.6"/>
          <circle cx="260" cy="260" r="60"  stroke="var(--accent-gold)" strokeWidth="0.6"/>
          <line x1="0" y1="260" x2="520" y2="260" stroke="var(--accent-gold)" strokeWidth="0.4"/>
          <line x1="260" y1="0" x2="260" y2="520" stroke="var(--accent-gold)" strokeWidth="0.4"/>
        </svg>
        <div style={{flex:1}}/>
        <div style={{maxWidth: 460, position:'relative'}}>
          <div className="t-label" style={{color:'var(--accent-gold)', marginBottom:20}}>Internal · 2026</div>
          <h1 style={{fontSize:'clamp(40px, 5vw, 56px)', fontWeight:600, lineHeight:1.05, letterSpacing:'-0.025em', margin:0}}>
            Recognition, <span style={{color:'var(--accent-gold)', fontStyle:'italic', fontWeight:500}}>measured</span>.
          </h1>
          <p style={{fontSize:16, lineHeight:1.6, color:'rgba(238,241,246,0.7)', marginTop:20, maxWidth:420}}>
            SkillLane's internal merit &amp; rewards platform — for the people who make the company move.
          </p>
          <div style={{display:'flex', gap:32, marginTop:40, borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:24}}>
            <Stat label="Recognitions this quarter" value="2,480"/>
            <Stat label="Active employees"          value="232"/>
            <Stat label="Rewards in catalog"        value="42"/>
          </div>
        </div>
      </div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', padding:'56px 40px'}}>
        {formPanel}
      </div>
    </div>
  );
};

const Stat = ({label, value}) => (
  <div>
    <div className="num" style={{fontSize:28, fontWeight:600, letterSpacing:'-0.02em', color:'var(--accent-gold)'}}>{value}</div>
    <div style={{fontSize:12, fontWeight:500, color:'rgba(238,241,246,0.55)', letterSpacing:'0.04em', marginTop:4, textTransform:'uppercase'}}>{label}</div>
  </div>
);

const Spinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{animation:'spin 1s linear infinite'}}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25"/>
    <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Mobile
const LoginScreenMobile = ({ onSignIn }) => {
  const [phase, setPhase] = React.useState('idle');
  const [error, setError] = React.useState(null);
  const ACCOUNTS = [
    { email: 'thitichaya.c@skilllane.com',ok: true, reason: null },
    { email: 'guest@gmail.com',          ok: false, reason: 'domain' },
    { email: 'deactivated@skilllane.com',ok: false, reason: 'deactivated' },
  ];
  const attempt = (mail) => {
    setError(null); setPhase('loading');
    setTimeout(() => {
      const hit = ACCOUNTS.find(a => a.email === mail);
      const domainOk = /@skilllane\.com$/i.test(mail);
      if ((hit && !hit.ok) || !domainOk) {
        setPhase('error');
        setError(hit && hit.reason === 'deactivated'
          ? { title: 'Account deactivated', body: 'This SkillLane account is no longer active. Contact People Ops.' }
          : { title: 'Unauthorized email domain', body: 'Sign in with your @skilllane.com work email.' });
        return;
      }
      onSignIn();
    }, 800);
  };

  return (
    <div style={{minHeight:'100%', background:'var(--nav-navy)', color:'#fff', display:'flex', flexDirection:'column', padding:'32px 24px 40px'}}>
      <Brand/>
      <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', paddingTop:20, paddingBottom:32}}>
        <div className="t-label" style={{color:'var(--accent-gold)', marginBottom:14}}>Internal · 2026</div>
        <h1 style={{fontSize:38, fontWeight:600, lineHeight:1.05, letterSpacing:'-0.025em', margin:0}}>
          Recognition,<br/><span style={{color:'var(--accent-gold)', fontStyle:'italic', fontWeight:500}}>measured</span>.
        </h1>
        <p style={{fontSize:15, lineHeight:1.6, color:'rgba(238,241,246,0.7)', marginTop:16}}>
          Restricted to <strong style={{color:'#fff'}}>@skilllane.com</strong> accounts.
        </p>
      </div>

      {error && (
        <div role="alert" style={{
          padding:'12px 14px', borderRadius:10,
          background:'rgba(224,82,82,0.15)',
          border:'1px solid rgba(224,82,82,0.4)',
          display:'flex', gap:10, marginBottom:14,
        }}>
          <div style={{width:20, height:20, borderRadius:'50%', background:'var(--error)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:700, fontSize:12}}>!</div>
          <div>
            <div style={{fontSize:13, fontWeight:600, color:'#FFB5B5'}}>{error.title}</div>
            <div style={{fontSize:12.5, lineHeight:1.5, color:'rgba(255,255,255,0.7)', marginTop:2}}>{error.body}</div>
          </div>
        </div>
      )}

      <button onClick={()=>attempt('thitichaya.c@skilllane.com')} disabled={phase==='loading'} style={{
        width:'100%', padding:'14px 20px', borderRadius:10,
        background:'#fff', color:'#1f1f1f',
        fontSize:14, fontWeight:600,
        display:'flex', alignItems:'center', justifyContent:'center', gap:10,
        border:'none', opacity: phase==='loading'?0.7:1,
      }}>
        {phase==='loading' ? <><Spinner/> Signing in…</> : <><GoogleG size={18}/> Continue with Google</>}
      </button>

      <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:6}}>
        {ACCOUNTS.map(a => (
          <button key={a.email} onClick={()=>attempt(a.email)} disabled={phase==='loading'} style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'9px 12px', borderRadius:8,
            background:'rgba(255,255,255,0.06)',
            border:'1px solid rgba(255,255,255,0.1)',
            fontSize:12, color:'rgba(255,255,255,0.85)', textAlign:'left',
          }}>
            <span style={{width:7, height:7, borderRadius:'50%', background: a.ok?'var(--success)':'var(--error)'}}/>
            <span className="num" style={{flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{a.email}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { LoginScreen, LoginScreenMobile });
