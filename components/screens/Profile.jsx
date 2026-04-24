// My Profile — avatar, total points, badges, activity summary
const ProfileScreen = ({ data, setScreen, isMobile }) => {
  const toast = useToast();
  const { currentUser, activity } = data;
  const [stateMode, setStateMode] = React.useState('normal');
  const rankDelta = currentUser.rankDeltaYoY;
  const earned    = activity.filter(t => t.amount > 0).reduce((a,b)=>a+b.amount, 0);
  const redeemed  = Math.abs(activity.filter(t => t.amount < 0).reduce((a,b)=>a+b.amount, 0));
  const recognitions = activity.filter(t => t.type === 'peer' || t.type === 'earned').length;

  // Loading preview — let reviewers see the shimmer pass
  if (stateMode === 'loading') {
    return (
      <div style={{position:'relative'}}>
        <div style={{position:'absolute', top:16, right:isMobile?16:48, zIndex:5}}>
          <StateModeSwitch value={stateMode} onChange={setStateMode} supportsError={false}/>
        </div>
        <SkeletonProfile isMobile={isMobile}/>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth: 1280, margin:'0 auto'}}>
      {/* State preview switcher — top-right, non-intrusive */}
      <div style={{display:'flex', justifyContent:'flex-end', marginBottom:12}}>
        <StateModeSwitch value={stateMode} onChange={setStateMode} supportsError={false}/>
      </div>
      {/* Hero */}
      <div className="card" style={{padding: isMobile?24:40, marginBottom:24, display:'flex', alignItems:'center', gap:isMobile?20:32, flexDirection: isMobile?'column':'row', textAlign: isMobile?'center':'left'}}>
        <div style={{position:'relative'}}>
          <Avatar initials={currentUser.avatarInitials} tone="gold" size={isMobile?96:120} ring/>
          <div style={{
            position:'absolute', bottom:-4, right:-4,
            padding:'3px 10px', borderRadius:999,
            background:'var(--nav-navy)', color:'#fff',
            fontSize:11, fontWeight:600, letterSpacing:'0.04em',
          }} className="num">#{currentUser.rank}</div>
          {rankDelta ? (
            <div
              className="num"
              aria-label={`Moved ${rankDelta > 0 ? 'up' : 'down'} ${Math.abs(rankDelta)} ${Math.abs(rankDelta) === 1 ? 'place' : 'places'} year over year`}
              style={{
                marginTop:8, textAlign:'center',
                fontSize:12, fontWeight:500,
                color: rankDelta > 0 ? 'var(--accent-gold)' : 'var(--error)',
              }}
            >
              {rankDelta > 0 ? '↑' : '↓'} {Math.abs(rankDelta)} {Math.abs(rankDelta) === 1 ? 'place' : 'places'} YoY
            </div>
          ) : null}
        </div>
        <div style={{flex:1, minWidth:0}}>
          <div className="t-label muted">{currentUser.team} · Member since {currentUser.joined}</div>
          <h1 style={{margin:'6px 0 4px', fontSize: isMobile?28:36, fontWeight:600, letterSpacing:'-0.02em'}}>{currentUser.name}</h1>
          <p className="t-body muted" style={{margin:0}}>{currentUser.role}</p>
          <div style={{display:'flex', gap:10, marginTop:16, flexWrap:'wrap', justifyContent: isMobile?'center':'flex-start'}}>
            <button className="btn btn-ghost" style={{padding:'10px 16px', fontSize:13}} onClick={() => setScreen('editprofile')}>Edit profile</button>
            <button className="btn btn-ghost" style={{padding:'10px 16px', fontSize:13}} onClick={() => setScreen('feed')}>
              <Icon name="sparkles" size={14}/> Recognize a colleague
            </button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr 1fr':'repeat(4, 1fr)', gap: isMobile?10:20, marginBottom:24}}>
        <HeroStat label="Current balance" value={currentUser.balance.toLocaleString()} suffix="pts" accent/>
        <HeroStat label="Lifetime earned" value={currentUser.lifetime.toLocaleString()} suffix="pts"/>
        <HeroStat label="Redeemed" value={redeemed.toLocaleString()} suffix="pts"/>
        <HeroStat label="Recognitions" value={recognitions} suffix="total"/>
      </div>

      <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr':'minmax(0, 1.3fr) minmax(0,1fr)', gap: 24}}>
        {/* Badges */}
        <section className="card" style={{padding: isMobile?20:28}}>
          <SectionHeader title="Badges"/>
          <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr 1fr':'1fr 1fr', gap:12}}>
            {currentUser.badges.map(b => <BadgeCard key={b.id} b={b}/>)}
            <div style={{
              border:'1.5px dashed var(--border)', borderRadius:12,
              padding:20, display:'flex', flexDirection:'column', justifyContent:'center',
              minHeight: 110,
            }}>
              <div className="t-caption muted">Next badge</div>
              <div style={{fontSize:14, fontWeight:600, marginTop:4}}>Ten-Year Mark</div>
              <div className="t-caption muted" style={{marginTop:6}}>Earned at 10 years. <span className="num">5 yrs to go.</span></div>
            </div>
          </div>
        </section>

        {/* Activity summary */}
        <section className="card" style={{padding: isMobile?20:28}}>
          <SectionHeader title="Activity summary" action={{label:'Full history', onClick: () => setScreen('history')}}/>
          <div style={{display:'flex', flexDirection:'column', gap:16}}>
            <ActivityBar label="Shipped Work"       pct={44} value="+830" color="var(--accent-gold)"/>
            <ActivityBar label="Peer Recognition"   pct={28} value="+560" color="#8FB2D9"/>
            <ActivityBar label="Above & Beyond"     pct={18} value="+360" color="var(--success)"/>
            <ActivityBar label="Milestone"          pct={10} value="+200" color="#B8A7D1"/>
          </div>
          <div style={{marginTop:20, paddingTop:16, borderTop:'1px solid var(--border-soft)', display:'flex', justifyContent:'space-between'}}>
            <span className="t-caption muted">Past 12 months</span>
            <span className="num" style={{fontSize:13, fontWeight:600}}>+1,950 earned</span>
          </div>
        </section>
      </div>
    </div>
  );
};

const HeroStat = ({label, value, suffix, accent}) => (
  <div className="card" style={{padding: 20}}>
    <div className="t-label muted">{label}</div>
    <div style={{display:'flex', alignItems:'baseline', gap:6, marginTop:10}}>
      <div className="num" style={{fontSize:28, fontWeight:600, letterSpacing:'-0.015em', color: accent?'var(--accent-gold)':'var(--text)'}}>{value}</div>
      <div className="t-caption muted">{suffix}</div>
    </div>
  </div>
);

const BadgeCard = ({ b }) => {
  const kinds = {
    tenure:    { shape:'hexagon', label:'Tenure' },
    peer:      { shape:'circle',  label:'Peer' },
    milestone: { shape:'diamond', label:'Milestone' },
    quarter:   { shape:'square',  label:'Quarter' },
  };
  const k = kinds[b.kind] || kinds.peer;
  return (
    <div style={{
      padding:16, borderRadius:12,
      background:'var(--surface-muted)',
      border:'1px solid var(--border-soft)',
      display:'flex', gap:14, alignItems:'center',
    }}>
      <BadgeShape kind={k.shape}/>
      <div style={{minWidth:0}}>
        <div className="t-caption muted">{k.label}</div>
        <div style={{fontSize:14, fontWeight:600, marginTop:2}}>{b.name}</div>
        <div className="t-caption muted num" style={{marginTop:2}}>{b.earned}</div>
      </div>
    </div>
  );
};

const BadgeShape = ({ kind }) => {
  const common = { width: 44, height: 44, style: { flexShrink: 0 } };
  if (kind === 'circle') return (
    <svg {...common} viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="20" fill="none" stroke="var(--accent-gold)" strokeWidth="1.2"/>
      <circle cx="22" cy="22" r="10" fill="var(--accent-gold)"/>
    </svg>
  );
  if (kind === 'diamond') return (
    <svg {...common} viewBox="0 0 44 44" fill="none">
      <rect x="9" y="9" width="26" height="26" rx="2" transform="rotate(45 22 22)" fill="none" stroke="var(--accent-gold)" strokeWidth="1.2"/>
      <rect x="15" y="15" width="14" height="14" rx="1" transform="rotate(45 22 22)" fill="var(--accent-gold)"/>
    </svg>
  );
  if (kind === 'square') return (
    <svg {...common} viewBox="0 0 44 44" fill="none">
      <rect x="4" y="4" width="36" height="36" rx="6" fill="none" stroke="var(--accent-gold)" strokeWidth="1.2"/>
      <rect x="13" y="13" width="18" height="18" rx="3" fill="var(--accent-gold)"/>
    </svg>
  );
  // hexagon
  return (
    <svg {...common} viewBox="0 0 44 44" fill="none">
      <polygon points="22,3 39,13 39,31 22,41 5,31 5,13" fill="none" stroke="var(--accent-gold)" strokeWidth="1.2"/>
      <polygon points="22,12 31,17 31,27 22,32 13,27 13,17" fill="var(--accent-gold)"/>
    </svg>
  );
};

const ActivityBar = ({ label, pct, value, color }) => (
  <div>
    <div style={{display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:500, marginBottom:6}}>
      <span>{label}</span>
      <span className="num muted">{value} <span style={{color:'var(--text-subtle)', marginLeft:6}}>{pct}%</span></span>
    </div>
    <div style={{height:6, borderRadius:3, background:'var(--surface-muted)', overflow:'hidden'}}>
      <div style={{width:`${pct}%`, height:'100%', background: color, borderRadius:3, transition:'width 400ms ease-out'}}/>
    </div>
  </div>
);

Object.assign(window, { ProfileScreen });
