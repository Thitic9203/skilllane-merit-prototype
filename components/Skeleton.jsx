// Skeleton loaders — shimmering placeholders shown while data is fetching.
// Visuals follow the app's design tokens: match corner radii, use --border-soft
// gradient base, keep the shimmer subtle. Dark-mode adapts via CSS vars.
//
// Primitive: <Skeleton w h radius variant />
// Variants:  SkeletonText · SkeletonAvatar · SkeletonStat · SkeletonCard
// Templates: SkeletonDashboard · SkeletonHistory · SkeletonRewards
//            SkeletonFeed · SkeletonProfile · SkeletonTeam
// Usage:     if (loading) return <SkeletonDashboard isMobile={isMobile}/>;

// Primitive bone — everything composes from this
const Skeleton = ({ w = '100%', h = 14, radius = 6, style, className = '' }) => (
  <div
    aria-hidden="true"
    className={`skeleton ${className}`}
    style={{
      width: typeof w === 'number' ? `${w}px` : w,
      height: typeof h === 'number' ? `${h}px` : h,
      borderRadius: radius,
      ...style,
    }}
  />
);

// Multi-line text block (last line is usually shorter)
const SkeletonText = ({ lines = 3, lineHeight = 12, gap = 10, widths, style }) => {
  const ws = widths || Array.from({ length: lines }, (_, i) => i === lines - 1 ? '65%' : '100%');
  return (
    <div style={{display:'flex', flexDirection:'column', gap, ...style}} aria-hidden="true" aria-busy="true">
      {ws.map((w, i) => <Skeleton key={i} w={w} h={lineHeight}/>)}
    </div>
  );
};

// Circular avatar placeholder
const SkeletonAvatar = ({ size = 40 }) => (
  <div aria-hidden="true" className="skeleton" style={{width:size, height:size, borderRadius:'50%', flexShrink:0}}/>
);

// Stat card skeleton (mirrors SummaryStat)
const SkeletonStat = () => (
  <div className="card" style={{padding:18}}>
    <Skeleton w={72} h={10}/>
    <div style={{height:10}}/>
    <Skeleton w={110} h={24} radius={8}/>
  </div>
);

// Full-bleed card frame with content slot
const SkeletonCard = ({ padding = 24, children, style }) => (
  <div className="card" style={{padding, ...style}}>{children}</div>
);

// ---------------------------------------------------------------------------
// Screen-level templates — match the real component layouts so the transition
// into live content doesn't jar. Each accepts isMobile to adapt spacing.
// ---------------------------------------------------------------------------

// Reusable header skeleton block
const SkeletonHeader = () => (
  <div style={{marginBottom:22}}>
    <Skeleton w={80} h={10}/>
    <div style={{height:10}}/>
    <Skeleton w="42%" h={30} radius={8}/>
    <div style={{height:10}}/>
    <Skeleton w="62%" h={12}/>
  </div>
);

// Dashboard — hero balance card + two-column supporting
const SkeletonDashboard = ({ isMobile }) => (
  <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth:1280, margin:'0 auto'}}>
    <SkeletonHeader/>
    {/* Hero balance card */}
    <SkeletonCard padding={isMobile?24:36} style={{marginBottom:24, background:'linear-gradient(135deg, var(--surface) 0%, var(--surface-muted) 100%)'}}>
      <Skeleton w={90} h={11}/>
      <div style={{height:16}}/>
      <Skeleton w={isMobile?180:260} h={isMobile?52:72} radius={10}/>
      <div style={{height:18}}/>
      <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
        <Skeleton w={140} h={38} radius={10}/>
        <Skeleton w={120} h={38} radius={10}/>
      </div>
    </SkeletonCard>
    {/* Supporting grid */}
    <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr':'2fr 1fr', gap:16, marginBottom:16}}>
      <SkeletonCard>
        <Skeleton w={140} h={12}/>
        <div style={{height:18}}/>
        {Array.from({length:4}).map((_,i) => (
          <div key={i} style={{display:'flex', gap:14, alignItems:'center', padding:'12px 0', borderBottom: i<3 ? '1px solid var(--border-soft)' : 'none'}}>
            <SkeletonAvatar size={36}/>
            <div style={{flex:1}}>
              <Skeleton w="70%" h={12}/>
              <div style={{height:6}}/>
              <Skeleton w="40%" h={10}/>
            </div>
            <Skeleton w={48} h={16} radius={6}/>
          </div>
        ))}
      </SkeletonCard>
      <SkeletonCard>
        <Skeleton w={110} h={12}/>
        <div style={{height:18}}/>
        <Skeleton w="100%" h={120} radius={10}/>
        <div style={{height:12}}/>
        <SkeletonText lines={2} widths={['90%','55%']}/>
      </SkeletonCard>
    </div>
  </div>
);

// History — summary strip + filter bar + ledger rows
const SkeletonHistory = ({ isMobile, noWrapper }) => {
  const body = (
    <>
      {!noWrapper && <SkeletonHeader/>}
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap: isMobile?10:16, marginBottom:24}}>
        <SkeletonStat/><SkeletonStat/><SkeletonStat/>
      </div>
      <SkeletonCard padding={isMobile?16:20} style={{marginBottom:16, display:'flex', gap:10, flexWrap:'wrap'}}>
        <Skeleton w={80} h={30} radius={8}/>
        <Skeleton w={120} h={30} radius={8}/>
        <Skeleton w={140} h={30} radius={8}/>
        <div style={{flex:1}}/>
        <Skeleton w={100} h={30} radius={8}/>
      </SkeletonCard>
      <SkeletonCard padding={isMobile?'8px 16px':'8px 28px'}>
        {Array.from({length:6}).map((_,i) => (
          <div key={i} style={{
            display:'grid',
            gridTemplateColumns: isMobile ? '40px 1fr auto' : '44px 1fr 160px 110px',
            gap: isMobile?12:16, alignItems:'center',
            padding: isMobile?'14px 0':'18px 0',
            borderBottom: i<5 ? '1px solid var(--border-soft)' : 'none',
          }}>
            <Skeleton w={isMobile?36:40} h={isMobile?36:40} radius={10}/>
            <div>
              <Skeleton w="70%" h={13}/>
              <div style={{height:6}}/>
              <Skeleton w="40%" h={10}/>
            </div>
            {!isMobile && <Skeleton w={100} h={10} style={{justifySelf:'end'}}/>}
            <Skeleton w={70} h={16} radius={6} style={{justifySelf:'end'}}/>
          </div>
        ))}
      </SkeletonCard>
    </>
  );
  if (noWrapper) return body;
  return <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth:1280, margin:'0 auto'}}>{body}</div>;
};

// Rewards — filter chips + catalog grid
// noWrapper: skip the outer padding/header so it can slot into an existing screen
const SkeletonRewards = ({ isMobile, noWrapper }) => {
  const body = (
    <>
      {!noWrapper && <SkeletonHeader/>}
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:20}}>
        {[64, 82, 96, 72, 88].map((w, i) => <Skeleton key={i} w={w} h={32} radius={999}/>)}
      </div>
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile?'1fr 1fr':'repeat(auto-fill, minmax(260px, 1fr))',
        gap: isMobile?12:18,
      }}>
        {Array.from({length: isMobile?4:8}).map((_,i) => (
          <SkeletonCard key={i} padding={0} style={{overflow:'hidden'}}>
            <Skeleton w="100%" h={isMobile?100:140} radius={0}/>
            <div style={{padding:16}}>
              <Skeleton w="85%" h={13}/>
              <div style={{height:8}}/>
              <Skeleton w="45%" h={10}/>
              <div style={{height:14}}/>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <Skeleton w={62} h={18} radius={6}/>
                <Skeleton w={58} h={28} radius={8}/>
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>
    </>
  );
  if (noWrapper) return body;
  return (
    <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth:1280, margin:'0 auto'}}>
      {body}
    </div>
  );
};

// Feed — composer + post list
const SkeletonFeed = ({ isMobile, noWrapper }) => {
  const body = (
    <>
      {!noWrapper && <SkeletonHeader/>}
      <SkeletonCard padding={isMobile?20:28} style={{marginBottom:24}}>
        <div style={{display:'flex', gap:14, alignItems:'flex-start'}}>
          <SkeletonAvatar size={40}/>
          <div style={{flex:1}}>
            <div style={{display:'flex', gap:10, flexWrap:'wrap', marginBottom:12}}>
              <Skeleton w={110} h={28} radius={8}/>
              <Skeleton w={140} h={28} radius={8}/>
            </div>
            <Skeleton w="100%" h={80} radius={10}/>
            <div style={{height:14}}/>
            <div style={{display:'flex', justifyContent:'space-between', gap:10, flexWrap:'wrap'}}>
              <div style={{display:'flex', gap:6}}>
                {[0,1,2,3].map(i => <Skeleton key={i} w={56} h={30} radius={999}/>)}
              </div>
              <Skeleton w={150} h={38} radius={10}/>
            </div>
          </div>
        </div>
      </SkeletonCard>
      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        {Array.from({length:3}).map((_,i) => (
          <SkeletonCard key={i}>
            <div style={{display:'flex', gap:14, alignItems:'flex-start'}}>
              <SkeletonAvatar size={44}/>
              <div style={{flex:1}}>
                <div style={{display:'flex', gap:8, alignItems:'center'}}>
                  <Skeleton w={110} h={13}/>
                  <Skeleton w={90} h={13}/>
                  <Skeleton w={56} h={18} radius={999}/>
                </div>
                <div style={{height:8}}/>
                <Skeleton w="35%" h={10}/>
                <div style={{height:14}}/>
                <SkeletonText lines={2} widths={['100%','72%']}/>
                <div style={{height:16}}/>
                <div style={{display:'flex', gap:6}}>
                  {[0,1,2,3,4].map(j => <Skeleton key={j} w={32} h={32} radius={999}/>)}
                </div>
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>
    </>
  );
  if (noWrapper) return body;
  return <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth:900, margin:'0 auto'}}>{body}</div>;
};

// Profile — header card + badges + stats grid
const SkeletonProfile = ({ isMobile }) => (
  <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth:1120, margin:'0 auto'}}>
    <SkeletonHeader/>
    <SkeletonCard padding={isMobile?24:32} style={{marginBottom:20}}>
      <div style={{display:'flex', gap:20, alignItems:'center', flexWrap:'wrap'}}>
        <SkeletonAvatar size={isMobile?72:96}/>
        <div style={{flex:1, minWidth:200}}>
          <Skeleton w="55%" h={22}/>
          <div style={{height:10}}/>
          <Skeleton w="70%" h={12}/>
          <div style={{height:14}}/>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <Skeleton w={90} h={26} radius={999}/>
            <Skeleton w={70} h={26} radius={999}/>
            <Skeleton w={110} h={26} radius={999}/>
          </div>
        </div>
      </div>
    </SkeletonCard>
    <div style={{display:'grid', gridTemplateColumns: isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap:14, marginBottom:20}}>
      {Array.from({length:4}).map((_,i) => <SkeletonStat key={i}/>)}
    </div>
    <SkeletonCard>
      <Skeleton w={140} h={12}/>
      <div style={{height:18}}/>
      <div style={{display:'grid', gridTemplateColumns: isMobile?'repeat(3,1fr)':'repeat(6,1fr)', gap:14}}>
        {Array.from({length:6}).map((_,i) => (
          <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
            <Skeleton w={56} h={56} radius={14}/>
            <Skeleton w="70%" h={10}/>
          </div>
        ))}
      </div>
    </SkeletonCard>
  </div>
);

// Team dashboard — KPIs + chart + leaderboard
const SkeletonTeam = ({ isMobile, noWrapper }) => {
  const body = (
    <>
      {!noWrapper && <SkeletonHeader/>}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:14, marginBottom:20}}>
        {Array.from({length:4}).map((_,i) => <SkeletonStat key={i}/>)}
      </div>
      <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr':'1.4fr 1fr', gap:16}}>
        <SkeletonCard>
          <Skeleton w={140} h={12}/>
          <div style={{height:18}}/>
          <Skeleton w="100%" h={220} radius={10}/>
        </SkeletonCard>
        <SkeletonCard>
          <Skeleton w={120} h={12}/>
          <div style={{height:18}}/>
          {Array.from({length:5}).map((_,i) => (
            <div key={i} style={{display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom: i<4 ? '1px solid var(--border-soft)' : 'none'}}>
              <Skeleton w={26} h={26} radius={8}/>
              <SkeletonAvatar size={32}/>
              <div style={{flex:1}}>
                <Skeleton w="70%" h={12}/>
                <div style={{height:6}}/>
                <Skeleton w="40%" h={10}/>
              </div>
              <Skeleton w={44} h={14} radius={6}/>
            </div>
          ))}
        </SkeletonCard>
      </div>
    </>
  );
  if (noWrapper) return body;
  return <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth:1280, margin:'0 auto'}}>{body}</div>;
};

// Award — form card + preview sidebar
const SkeletonAward = ({ isMobile, noWrapper }) => {
  const body = (
    <>
      {!noWrapper && <SkeletonHeader/>}
      <div style={{display:'grid', gridTemplateColumns: isMobile?'1fr':'minmax(0,1.3fr) minmax(0,1fr)', gap:24}}>
        <SkeletonCard padding={isMobile?20:32}>
          {Array.from({length:5}).map((_,i) => (
            <div key={i} style={{marginBottom:22}}>
              <Skeleton w={90} h={10}/>
              <div style={{height:10}}/>
              <Skeleton w="100%" h={i===3 ? 96 : 44} radius={10}/>
            </div>
          ))}
        </SkeletonCard>
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          <SkeletonCard padding={24} style={{background:'var(--nav-navy)'}}>
            <Skeleton w={90} h={10}/>
            <div style={{height:14}}/>
            <Skeleton w={160} h={56} radius={10}/>
            <div style={{height:14}}/>
            <Skeleton w={120} h={12}/>
          </SkeletonCard>
          <SkeletonCard><Skeleton w={80} h={10}/><div style={{height:14}}/><Skeleton w="100%" h={80} radius={10}/></SkeletonCard>
          <Skeleton w="100%" h={48} radius={10}/>
        </div>
      </div>
    </>
  );
  if (noWrapper) return body;
  return <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth:1100, margin:'0 auto'}}>{body}</div>;
};

Object.assign(window, {
  Skeleton, SkeletonText, SkeletonAvatar, SkeletonStat, SkeletonCard,
  SkeletonDashboard, SkeletonHistory, SkeletonRewards,
  SkeletonFeed, SkeletonProfile, SkeletonTeam, SkeletonAward,
});
