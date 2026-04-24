// Admin: Team Dashboard — analytics + top performers
const TeamDashboard = ({ data, isMobile, setScreen }) => {
  const { teamDashboard } = data;
  const { headline, trend, categoryBreakdown, topPerformers } = teamDashboard;
  const [stateMode, setStateMode] = React.useState('normal');
  const [deptFilter, setDeptFilter] = React.useState('All departments');

  const filteredPerformers = deptFilter === 'All departments'
    ? topPerformers
    : topPerformers.filter(p => p.team && p.team.toLowerCase().includes(deptFilter.toLowerCase()));

  return (
    <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth: 1280, margin:'0 auto'}}>
      <ScreenHeader
        eyebrow={<span style={{display:'inline-flex', alignItems:'center', gap:6}}><Icon name="shield" size={12}/> Manager view</span>}
        title="Team dashboard"
        desc={`${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · Updated just now`}
        stateMode={stateMode} onStateModeChange={setStateMode}
        right={
          <div style={{display:'flex', gap:10}}>
            <select
              className="input"
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              style={{width:'auto', padding:'10px 12px', fontSize:13}}
            >
              <option>All departments</option>
              <option>Engineering</option>
              <option>Design</option>
              <option>Sales</option>
            </select>
            <button className="btn btn-primary" onClick={() => setScreen('approve')}>
              <Icon name="send" size={14}/> Review approvals
            </button>
          </div>
        }
      />

      {stateMode === 'loading' ? (
        <SkeletonTeam isMobile={isMobile} noWrapper/>
      ) : stateMode === 'error' ? (
        <div className="card" style={{padding:20}}>
          <PageError title="Analytics are temporarily unavailable" body="We couldn't reach the reporting service. Your team's balances are safe — try again shortly." onRetry={()=>setStateMode('normal')}/>
        </div>
      ) : stateMode === 'empty' ? (
        <div className="card" style={{padding:20}}>
          <EmptyState kind="team" title="Not enough data to report yet" body="Once your team exchanges more recognitions this period, analytics and top performers will populate here." actions={[<button key="a" className="btn btn-primary" onClick={()=>setScreen('award')}>Award points to get started</button>]}/>
        </div>
      ) : (<>

      {/* Headline stats */}
      <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr 1fr':'repeat(4, 1fr)', gap: isMobile?10:20, marginBottom: 24}}>
        <TeamStat label="Points awarded" value={headline.awardedThisMonth.toLocaleString()} hint="+18% vs March" accent/>
        <TeamStat label="Recognitions" value={headline.recognitions} hint="87 peer-to-peer"/>
        <TeamStat label="Active participants" value={`${headline.activeParticipants}/${headline.totalHeadcount}`} hint="81% engagement"/>
        <TeamStat label="Avg. per recognition" value="74" suffix="pts" hint="stable"/>
      </div>

      <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr':'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 24, marginBottom: 24}}>
        {/* Trend */}
        <section className="card" style={{padding: isMobile?20:28}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20}}>
            <div>
              <div className="t-label muted">Weekly awarded</div>
              <h3 className="t-h3" style={{margin:'4px 0 0'}}>Last 12 weeks</h3>
            </div>
            <div style={{display:'flex', gap:14, fontSize:12}}>
              <LegendDot color="var(--accent-gold)" label="This period"/>
              <LegendDot color="var(--text-subtle)" label="Previous" dashed/>
            </div>
          </div>
          <TrendChart data={trend}/>
        </section>

        {/* Category breakdown */}
        <section className="card" style={{padding: isMobile?20:28}}>
          <SectionHeader title="Category mix"/>
          <div style={{display:'flex', flexDirection:'column', gap:16}}>
            {categoryBreakdown.map((c, i) => (
              <CategoryBar key={c.label} c={c} color={categoryColor(i)}/>
            ))}
          </div>
          <div style={{marginTop:20, paddingTop:16, borderTop:'1px solid var(--border-soft)', display:'flex', justifyContent:'space-between'}}>
            <span className="t-caption muted">Total awards</span>
            <span className="num" style={{fontSize:14, fontWeight:600}}>247 · {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
        </section>
      </div>

      <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr':'minmax(0, 1fr) minmax(0, 1fr)', gap: 24}}>
        {/* Top performers */}
        <section className="card" style={{padding: isMobile?20:28}}>
          <SectionHeader title={`Top performers — ${new Date().toLocaleDateString('en-US', { month: 'long' })}`}/>
          <div style={{display:'flex', flexDirection:'column', gap:2}}>
            {filteredPerformers.length === 0 ? (
            <div style={{padding:'24px 0', textAlign:'center', color:'var(--text-subtle)', fontSize:13}}>
              No performers in this department yet.
            </div>
          ) : filteredPerformers.map((p, i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap:14, padding:'12px 4px', borderBottom: i < filteredPerformers.length-1 ? '1px solid var(--border-soft)' : 'none'}}>
                <RankChip rank={i+1}/>
                <Avatar initials={p.initials} size={36} tone="navy"/>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:14, fontWeight:500}}>{p.name}</div>
                  <div className="t-caption muted">{p.team}</div>
                </div>
                <div className="num" style={{fontSize:15, fontWeight:600, color:'var(--success)'}}>+{p.delta.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Distribution (simple bar chart) */}
        <section className="card" style={{padding: isMobile?20:28}}>
          <SectionHeader title="Awards by team"/>
          <div style={{display:'flex', flexDirection:'column', gap:16}}>
            <BarRow label="Engineering"  pct={88} value="4,820"/>
            <BarRow label="Sales"         pct={72} value="3,940"/>
            <BarRow label="Customer Ops"  pct={58} value="3,180"/>
            <BarRow label="Design"        pct={46} value="2,520"/>
            <BarRow label="Marketing"     pct={38} value="2,080"/>
            <BarRow label="People & Fin"  pct={24} value="1,360"/>
          </div>
        </section>
      </div>
      </>)}
    </div>
  );
};

const categoryColor = (i) => ['var(--accent-gold)', '#8FB2D9', 'var(--success)', '#B8A7D1', '#C0C8D4'][i % 5];

const TeamStat = ({ label, value, suffix, hint, accent }) => (
  <div className="card" style={{padding:20}}>
    <div className="t-label muted">{label}</div>
    <div style={{display:'flex', alignItems:'baseline', gap:6, marginTop:10}}>
      <div className="num" style={{fontSize:26, fontWeight:600, letterSpacing:'-0.015em', color: accent?'var(--accent-gold)':'var(--text)'}}>{value}</div>
      {suffix && <div className="t-caption muted">{suffix}</div>}
    </div>
    <div className="t-caption" style={{color:'var(--text-muted)', marginTop:8}}>{hint}</div>
  </div>
);

const LegendDot = ({ color, label, dashed }) => (
  <span style={{display:'flex', alignItems:'center', gap:6, color:'var(--text-muted)'}}>
    <span style={{width:14, height:2, background: dashed ? 'transparent' : color, borderTop: dashed ? `2px dashed ${color}` : 'none'}}/>
    {label}
  </span>
);

// Minimal line/bar chart — navy+gold, no 3D
const TrendChart = ({ data }) => {
  const w = 640, h = 200, pad = {t:10, r:12, b:26, l:12};
  const max = Math.max(...data);
  const step = (w - pad.l - pad.r) / (data.length - 1);
  const y = (v) => pad.t + (h - pad.t - pad.b) * (1 - v / (max * 1.1));
  const x = (i) => pad.l + i * step;

  const points = data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const area = `M ${x(0)} ${h - pad.b} L ${data.map((v,i)=>`${x(i)} ${y(v)}`).join(' L ')} L ${x(data.length-1)} ${h - pad.b} Z`;

  const prev = data.map((v, i) => v * (0.7 + (i/data.length) * 0.15));

  return (
    <div style={{width:'100%', overflow:'hidden'}}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%', height:'auto', display:'block'}}>
        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((r, i) => (
          <line key={i} x1={pad.l} x2={w-pad.r} y1={y(max*r)} y2={y(max*r)} stroke="var(--border-soft)" strokeWidth="1"/>
        ))}
        {/* Previous period */}
        <polyline
          fill="none" stroke="var(--text-subtle)" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5"
          points={prev.map((v,i)=>`${x(i)},${y(v)}`).join(' ')}
        />
        {/* Area */}
        <path d={area} fill="var(--accent-gold)" opacity="0.14"/>
        {/* Line */}
        <polyline fill="none" stroke="var(--accent-gold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" points={points}/>
        {/* Points */}
        {data.map((v,i)=>(
          <circle key={i} cx={x(i)} cy={y(v)} r={i === data.length-1 ? 4 : 2.5}
            fill={i === data.length-1 ? 'var(--accent-gold)' : 'var(--surface)'}
            stroke="var(--accent-gold)" strokeWidth={i === data.length-1 ? 0 : 1.5}/>
        ))}
        {/* X labels — a few weeks */}
        {['W1','W3','W5','W7','W9','W11'].map((l, i) => (
          <text key={i} x={x(i*2)} y={h - 8} fontSize="10" fill="var(--text-subtle)" textAnchor="middle" fontFamily="Inter" fontWeight="500">{l}</text>
        ))}
      </svg>
    </div>
  );
};

const CategoryBar = ({ c, color }) => (
  <div>
    <div style={{display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6}}>
      <span style={{fontWeight:500}}>{c.label}</span>
      <span className="num muted">{c.value}%</span>
    </div>
    <div style={{height:8, borderRadius:4, background:'var(--surface-muted)', overflow:'hidden'}}>
      <div style={{width:`${c.value*1.5}%`, maxWidth:'100%', height:'100%', background:color, borderRadius:4, transition:'width 400ms ease-out'}}/>
    </div>
  </div>
);

const BarRow = ({ label, pct, value }) => (
  <div>
    <div style={{display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6}}>
      <span style={{fontWeight:500}}>{label}</span>
      <span className="num muted">{value}</span>
    </div>
    <div style={{height:8, borderRadius:4, background:'var(--surface-muted)', overflow:'hidden'}}>
      <div style={{width:`${pct}%`, height:'100%', background:'var(--nav-navy)', borderRadius:4, transition:'width 400ms ease-out'}}/>
    </div>
  </div>
);

Object.assign(window, { TeamDashboard });
