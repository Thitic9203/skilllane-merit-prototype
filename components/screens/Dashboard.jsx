// Employee Dashboard — hero balance card, activity, leaderboard, quick actions
const Dashboard = ({ data, setScreen, isMobile }) => {
  const { currentUser, leaderboard, activity } = data;
  const [stateMode, setStateMode] = React.useState('normal');

  // Loading preview — same shell, skeleton body so reviewers can see the
  // transition into the real layout without losing the state switcher.
  if (stateMode === 'loading') {
    return (
      <div style={{position:'relative'}}>
        <div style={{position:'absolute', top:16, right:isMobile?16:48, zIndex:5}}>
          <StateModeSwitch value={stateMode} onChange={setStateMode}/>
        </div>
        <SkeletonDashboard isMobile={isMobile}/>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{
      padding: isMobile ? '20px 16px 32px' : '40px 48px 80px',
      maxWidth: 1280, margin: '0 auto',
    }}>
      {/* Greeting */}
      <div style={{marginBottom: isMobile ? 20 : 32, display:'flex', alignItems:'end', justifyContent:'space-between', gap:16, flexWrap:'wrap'}}>
        <div>
          <div className="t-label muted">{greeting()} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
          <h1 className="t-h1" style={{margin:'6px 0 0'}}>{currentUser.name.split(' ')[0]}</h1>
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          {!isMobile && (
            <>
              <StateModeSwitch value={stateMode} onChange={setStateMode}/>
              <button className="btn btn-primary" onClick={() => setScreen('rewards')}>
                Browse rewards <Icon name="arrow-right" size={16}/>
              </button>
            </>
          )}
        </div>
      </div>

      {stateMode === 'error' && (
        <ErrorBanner title="Some widgets failed to load" body="Your balance is cached and accurate, but the activity and leaderboard panels didn't respond. Try refreshing the page." onRetry={()=>setStateMode('normal')}/>
      )}

      {/* Hero balance + side stats */}
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: isMobile ? 16 : 24,
      }}>
        <MembershipCard user={currentUser} isMobile={isMobile}/>
        <div style={{display:'grid', gridTemplateRows: isMobile ? 'auto auto' : '1fr 1fr', gap: isMobile ? 16 : 24}}>
          <QuickStat
            label="This year"
            value={currentUser.balance.toLocaleString()}
            suffix="points"
            hint="2025 total"
          />
          <QuickStat
            label="Current rank"
            value={`#${currentUser.rank}`}
            suffix="of 232"
            hint="↑ 2 places this month"
            accent
          />
        </div>
      </div>

      {/* Quick actions — mobile */}
      {isMobile && (
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16}}>
          <button className="btn btn-ghost" onClick={() => setScreen('history')} style={{justifyContent:'flex-start', padding:14}}>
            <Icon name="history" size={16}/> Log activity
          </button>
          <button className="btn btn-primary" onClick={() => setScreen('rewards')} style={{justifyContent:'flex-start', padding:14}}>
            <Icon name="gift" size={16}/> Rewards
          </button>
        </div>
      )}

      {/* Two columns: activity + leaderboard */}
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: isMobile ? 20 : 24,
        marginTop: isMobile ? 28 : 40,
      }}>
        {/* Recent activity */}
        <section className="card" style={{padding: isMobile?20:28}}>
          <SectionHeader title="Recent activity" action={{label:'View all', onClick: () => setScreen('history')}}/>
          {stateMode === 'empty' ? (
            <EmptyState compact kind="history" title="No activity yet" body="Your recent merit transactions will appear here as soon as you earn or redeem."/>
          ) : stateMode === 'error' ? (
            <EmptyState compact kind="history" title="Couldn't load activity" body="Refresh the page, or try again in a moment."/>
          ) : (
            <div style={{display:'flex', flexDirection:'column'}}>
              {activity.slice(0,5).map((tx, i) => (
                <TransactionRow key={tx.id} tx={tx} last={i === 4}/>
              ))}
            </div>
          )}
        </section>

        {/* Leaderboard */}
        <section className="card" style={{padding: isMobile?20:28}}>
          <SectionHeader title="This quarter · Top 10" action={null}/>
          {stateMode === 'empty' ? (
            <EmptyState compact kind="team" title="No leaderboard yet" body="Rankings appear once the quarter has enough activity."/>
          ) : stateMode === 'error' ? (
            <EmptyState compact kind="team" title="Rankings unavailable" body="The leaderboard service didn't respond. Try again shortly."/>
          ) : (
            <>
          <div style={{display:'flex', flexDirection:'column', gap:2}}>
            {leaderboard.slice(0,7).map(p => (
              <LeaderRow key={p.rank} p={p}/>
            ))}
          </div>
          <div style={{marginTop:16, paddingTop:16, borderTop:'1px solid var(--border-soft)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div className="t-caption muted">Your rank</div>
              <div className="num" style={{fontSize:18, fontWeight:600}}>#{currentUser.rank} of 232</div>
            </div>
            <button onClick={() => setScreen('leaderboard')} style={{color:'var(--text-muted)', fontSize:13, fontWeight:500, display:'flex', alignItems:'center', gap:4}}>
              View all <Icon name="arrow-right" size={14}/>
            </button>
          </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

// The hero "membership card" — navy always, gold display number
const MembershipCard = ({ user, isMobile }) => (
  <div style={{
    position:'relative',
    background: 'linear-gradient(135deg, #0B1E3D 0%, #1A3260 50%, #2A4574 100%)',
    color: '#fff',
    borderRadius: 'var(--r-2xl)',
    padding: isMobile ? 24 : 36,
    overflow: 'hidden',
    boxShadow: 'var(--shadow-card), 0 0 0 1px rgba(200,169,110,0.12)',
    minHeight: isMobile ? 240 : 280,
  }}>
    {/* Subtle gold watermark */}
    <svg style={{position:'absolute', right:-40, top:-40, opacity:0.18}} width="280" height="280" viewBox="0 0 280 280" fill="none">
      <circle cx="140" cy="140" r="130" stroke="var(--accent-gold)" strokeWidth="0.5"/>
      <circle cx="140" cy="140" r="95"  stroke="var(--accent-gold)" strokeWidth="0.5"/>
      <circle cx="140" cy="140" r="60"  stroke="var(--accent-gold)" strokeWidth="0.5"/>
    </svg>
    <div style={{display:'flex', justifyContent:'space-between', position:'relative'}}>
      <div className="t-label" style={{color:'rgba(255,255,255,0.5)'}}>Your balance</div>
      <div style={{display:'flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:999, background:'rgba(200,169,110,0.12)', color:'var(--accent-gold)', fontSize:11, fontWeight:500, letterSpacing:'0.05em', textTransform:'uppercase'}}>
        <span style={{width:5, height:5, borderRadius:'50%', background:'var(--accent-gold)'}}/> Active · Q2 2026
      </div>
    </div>
    <div className="num t-display" style={{color:'var(--accent-gold)', marginTop:isMobile?14:20, position:'relative'}}>
      {user.balance.toLocaleString()}
    </div>
    <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8, position:'relative'}}>
      <span className="t-body-sm" style={{color:'rgba(255,255,255,0.7)'}}>Merit points · redeemable</span>
      <span style={{width:3, height:3, borderRadius:'50%', background:'rgba(255,255,255,0.3)'}}/>
      <span className="t-body-sm" style={{color:'rgba(255,255,255,0.7)'}}>Expires Jun 30</span>
    </div>
    <div style={{marginTop: isMobile?18:28, paddingTop: isMobile?18:24, borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative'}}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <Avatar initials={user.avatarInitials} tone="gold" size={40}/>
        <div>
          <div style={{fontSize:14, fontWeight:600, lineHeight:1.2}}>{user.name}</div>
          <div style={{fontSize:12, opacity:0.65, lineHeight:1.2, marginTop:2}}>{user.role}</div>
        </div>
      </div>
      <div style={{textAlign:'right'}}>
        <div className="t-label" style={{color:'rgba(255,255,255,0.45)'}}>Member since</div>
        <div style={{fontSize:13, fontWeight:500, marginTop:2}}>{user.joined}</div>
      </div>
    </div>
  </div>
);

const QuickStat = ({ label, value, suffix, hint, accent }) => (
  <div className="card" style={{padding: 24, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
    <div className="t-label muted">{label}</div>
    <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:'auto'}}>
      <div className="num" style={{
        fontSize: 42, fontWeight: 600, letterSpacing:'-0.02em',
        color: accent ? 'var(--accent-gold)' : 'var(--text)',
        lineHeight: 1,
      }}>{value}</div>
      <div className="t-body-sm muted">{suffix}</div>
    </div>
    <div className="t-caption" style={{color:'var(--success)', marginTop:10}}>{hint}</div>
  </div>
);

const SectionHeader = ({ title, action }) => (
  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20}}>
    <h3 className="t-h3" style={{margin:0}}>{title}</h3>
    {action && (
      <button onClick={action.onClick} style={{color:'var(--text-muted)', fontSize:13, fontWeight:500, display:'flex', alignItems:'center', gap:4}}>
        {action.label} <Icon name="arrow-right" size={14}/>
      </button>
    )}
  </div>
);

// Clean transaction row — shared between dashboard + history
const TransactionRow = ({ tx, last }) => {
  const positive = tx.amount > 0;
  const icon = categoryIcon(tx.category);
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:14,
      padding:'14px 0',
      borderBottom: last ? 'none' : '1px solid var(--border-soft)',
    }}>
      <div style={{
        width:38, height:38, borderRadius:10,
        background:'var(--surface-muted)',
        display:'flex', alignItems:'center', justifyContent:'center',
        color:'var(--text-muted)', flexShrink:0,
      }}>
        <Icon name={icon} size={16}/>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:14, fontWeight:500, lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
          {tx.note}
        </div>
        <div className="t-caption muted" style={{marginTop:4, display:'flex', gap:8, alignItems:'center'}}>
          <span>{tx.from}</span>
          <span style={{width:2, height:2, borderRadius:'50%', background:'var(--text-subtle)'}}/>
          <span>{tx.when}</span>
        </div>
      </div>
      <div className="num" style={{
        fontSize: 15, fontWeight: 600,
        color: positive ? 'var(--success)' : 'var(--text-muted)',
        flexShrink: 0,
      }}>
        {positive ? '+' : ''}{tx.amount.toLocaleString()}
      </div>
    </div>
  );
};

const LeaderRow = ({ p }) => (
  <div style={{
    display:'flex', alignItems:'center', gap:12,
    padding:'10px 10px', borderRadius:10,
    background: p.isYou ? 'color-mix(in oklch, var(--accent-gold) 10%, transparent)' : 'transparent',
    border: p.isYou ? '1px solid color-mix(in oklch, var(--accent-gold) 30%, transparent)' : '1px solid transparent',
  }}>
    <RankChip rank={p.rank}/>
    <Avatar initials={p.initials} tone={p.isYou ? 'gold' : 'navy'} size={32}/>
    <div style={{flex:1, minWidth:0}}>
      <div style={{fontSize:13.5, fontWeight:p.isYou?600:500, lineHeight:1.3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
        {p.name} {p.isYou && <span style={{fontSize:10, fontWeight:500, color:'var(--accent-gold)', marginLeft:6, letterSpacing:'0.06em', textTransform:'uppercase'}}>You</span>}
      </div>
      <div className="t-caption muted">{p.team}</div>
    </div>
    <div className="num" style={{fontSize:14, fontWeight:600, letterSpacing:'-0.01em'}}>{p.points.toLocaleString()}</div>
  </div>
);

Object.assign(window, { Dashboard, TransactionRow, LeaderRow, MembershipCard, SectionHeader });
