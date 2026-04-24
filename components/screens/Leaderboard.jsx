// Leaderboard screen — full rankings, monthly/total toggle, bar chart
const currentQuarterLabel = () => {
  const now = new Date();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  return `Q${q} ${now.getFullYear()}`;
};

const LeaderboardScreen = ({ data, isMobile }) => {
  const { leaderboard, currentUser } = data;
  const [view, setView] = React.useState('monthly');

  const sorted = [...leaderboard].sort((a, b) =>
    view === 'monthly' ? b.monthlyPts - a.monthlyPts : b.points - a.points
  );

  const barMax = Math.max(...sorted.map(u => view === 'monthly' ? u.monthlyPts : u.points), 1);

  return (
    <div className="fade-in" style={{
      padding: isMobile ? '20px 16px 32px' : '40px 48px 80px',
      maxWidth: 900, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{marginBottom: isMobile ? 20 : 32, display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:12, flexWrap:'wrap'}}>
        <div>
          <div className="t-label muted">Rankings · {currentQuarterLabel()}</div>
          <h1 className="t-h1" style={{margin:'6px 0 0'}}>Leaderboard</h1>
        </div>
        <div style={{display:'flex', gap:6, padding:4, background:'var(--surface-muted)', borderRadius:10, border:'1px solid var(--border-soft)'}}>
          {[['monthly','This month'],['total','All-time']].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding:'6px 14px', borderRadius:7, fontSize:12.5, fontWeight:500,
              background: view===v ? 'var(--surface)' : 'transparent',
              color: view===v ? 'var(--text)' : 'var(--text-muted)',
              boxShadow: view===v ? '0 1px 3px rgba(11,30,61,0.08)' : 'none',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="card" style={{padding: isMobile ? 16 : 24, marginBottom: isMobile ? 16 : 24, overflow:'hidden'}}>
        <div className="t-label muted" style={{marginBottom:12}}>Points comparison · Top 10</div>
        <div style={{display:'flex', flexDirection:'column', gap:8}}>
          {sorted.slice(0, 10).map((u, i) => {
            const pts = view === 'monthly' ? u.monthlyPts : u.points;
            const pct = (pts / barMax) * 100;
            const isMe = u.id === currentUser.id || u.initials === currentUser.avatarInitials;
            return (
              <div key={u.rank} style={{display:'flex', alignItems:'center', gap:10}}>
                <div className="num muted" style={{width:24, fontSize:12, flexShrink:0, textAlign:'right'}}>{i+1}</div>
                <div style={{fontSize:12.5, fontWeight:500, width: isMobile?80:140, flexShrink:0, color: isMe ? 'var(--accent-gold)' : 'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                  {u.name.split(' ')[0]}{isMe ? ' ← you' : ''}
                </div>
                <div style={{flex:1, height:8, background:'var(--surface-muted)', borderRadius:4, overflow:'hidden'}}>
                  <div style={{height:'100%', width:`${pct}%`, borderRadius:4, background: isMe ? 'var(--accent-gold)' : 'var(--nav-navy)', opacity: isMe ? 1 : 0.65, transition:'width 0.5s ease-out'}}/>
                </div>
                <div className="num" style={{fontSize:12.5, fontWeight:600, width:60, textAlign:'right', flexShrink:0, color: isMe ? 'var(--accent-gold)' : 'var(--text)'}}>{pts.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full list */}
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        {sorted.map((u, i) => {
          const pts = view === 'monthly' ? u.monthlyPts : u.points;
          const isMe = u.id === currentUser.id || u.initials === currentUser.avatarInitials;
          const medal = i === 0 ? 'var(--accent-gold)' : i === 1 ? '#9AA5B5' : i === 2 ? '#B08968' : null;
          return (
            <div key={u.rank} style={{
              display:'flex', alignItems:'center', gap:14,
              padding: '14px 18px', borderRadius:14,
              background: isMe ? 'color-mix(in oklch, var(--accent-gold) 8%, var(--surface))' : 'var(--surface)',
              border: isMe ? '1.5px solid color-mix(in oklch, var(--accent-gold) 30%, transparent)' : '1px solid var(--border-soft)',
              boxShadow: isMe ? '0 2px 10px rgba(200,169,110,0.12)' : '0 1px 3px rgba(11,30,61,0.04)',
            }}>
              <div style={{width:32, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
                {i < 3 ? (
                  <span style={{fontSize:20}}>{['🥇','🥈','🥉'][i]}</span>
                ) : (
                  <span className="num muted" style={{fontSize:13, fontWeight:500}}>#{i+1}</span>
                )}
              </div>
              <Avatar initials={u.initials} tone={medal ? 'gold' : 'navy'} size={36}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:14, fontWeight:isMe?600:500, color: isMe ? 'var(--text)' : 'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                  {u.name}{isMe ? <span style={{fontSize:11, color:'var(--accent-gold)', marginLeft:8, fontWeight:600}}>you</span> : ''}
                </div>
                <div className="muted" style={{fontSize:12, marginTop:2}}>{u.team}</div>
              </div>
              <div style={{textAlign:'right', flexShrink:0}}>
                <div className="num" style={{fontSize:16, fontWeight:700, color: medal || 'var(--text)', letterSpacing:'-0.02em'}}>{pts.toLocaleString()}</div>
                <div className="t-label muted" style={{fontSize:10, marginTop:1}}>{view === 'monthly' ? 'this month' : 'all-time'}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Object.assign(window, { LeaderboardScreen });
