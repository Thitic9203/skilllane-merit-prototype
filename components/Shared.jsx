// Icon set — thin stroke, 20x20, lucide-style custom
const Icon = ({ name, size = 20, className = '', style }) => {
  const s = size;
  const p = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', className, style };
  switch (name) {
    case 'home':        return <svg {...p}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>;
    case 'history':     return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'gift':        return <svg {...p}><rect x="3" y="8" width="18" height="5" rx="1"/><path d="M4 13v8h16v-8"/><path d="M12 8v13"/><path d="M12 8C10 5 7 5 7 7s2 2 5 1c3 1 5 1 5-1s-3-2-5 1z"/></svg>;
    case 'sparkles':    return <svg {...p}><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></svg>;
    case 'user':        return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>;
    case 'shield':      return <svg {...p}><path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"/></svg>;
    case 'chart':       return <svg {...p}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20v-5"/></svg>;
    case 'sun':         return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>;
    case 'moon':        return <svg {...p}><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg>;
    case 'search':      return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>;
    case 'bell':        return <svg {...p}><path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 004 0"/></svg>;
    case 'plus':        return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'check':       return <svg {...p}><path d="M5 12l5 5L20 7"/></svg>;
    case 'arrow-up':    return <svg {...p}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case 'arrow-down':  return <svg {...p}><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
    case 'arrow-right': return <svg {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'send':        return <svg {...p}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>;
    case 'filter':      return <svg {...p}><path d="M3 5h18l-7 9v5l-4 2v-7z"/></svg>;
    case 'coin':        return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1 1-2 3-2s3 1 3 2-1 1.5-3 2-3 1-3 2 1 2 3 2 3-1 3-2"/></svg>;
    case 'medal':       return <svg {...p}><circle cx="12" cy="14" r="6"/><path d="M8 3l4 6 4-6"/><path d="M12 11v3M10.5 13l1.5 1.5 1.5-1.5"/></svg>;
    case 'x':           return <svg {...p}><path d="M6 6l12 12M6 18L18 6"/></svg>;
    case 'menu':        return <svg {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case 'monitor':     return <svg {...p}><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
    case 'smartphone':  return <svg {...p}><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></svg>;
    default: return null;
  }
};

// Gold coin glyph — slightly ornate, used everywhere a point appears
const CoinGlyph = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
    <circle cx="8" cy="8" r="7" fill="var(--accent-gold)" />
    <circle cx="8" cy="8" r="5.2" fill="none" stroke="rgba(11,30,61,0.35)" strokeWidth="0.6" />
    <text x="8" y="10.8" textAnchor="middle" fontSize="7" fontWeight="700" fill="var(--nav-navy)" fontFamily="Inter, sans-serif">M</text>
  </svg>
);

// Avatar — initials on subtle tonal bg
const Avatar = ({ initials, size = 36, tone = 'navy', ring = false }) => {
  const toneBg = {
    navy:   'linear-gradient(135deg, #1a3260 0%, #0B1E3D 100%)',
    gold:   'linear-gradient(135deg, #D4B77F 0%, #C8A96E 100%)',
    slate:  'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
    ivory:  'linear-gradient(135deg, #F0F3F7 0%, #D6DBE4 100%)',
  }[tone] || 'linear-gradient(135deg, #1a3260 0%, #0B1E3D 100%)';
  const color = tone === 'ivory' ? '#0B1E3D' : tone === 'gold' ? '#0B1E3D' : '#fff';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: toneBg, color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 600, fontSize: size * 0.38, letterSpacing: '-0.01em',
      flexShrink: 0,
      boxShadow: ring ? `0 0 0 2px var(--surface), 0 0 0 3px var(--accent-gold)` : 'none',
    }}>{initials}</div>
  );
};

// Theme toggle — sun/moon 150ms cross-fade
const ThemeToggle = ({ theme, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    style={{
      width: 40, height: 40, borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.06)',
      color: '#fff',
      transition: 'background-color 200ms ease-out',
      position: 'relative',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
  >
    <div style={{position:'relative', width:20, height:20}}>
      <div style={{position:'absolute', inset:0, opacity: theme==='dark'?0:1, transition:'opacity 150ms ease-out'}}><Icon name="sun"/></div>
      <div style={{position:'absolute', inset:0, opacity: theme==='dark'?1:0, transition:'opacity 150ms ease-out'}}><Icon name="moon"/></div>
    </div>
  </button>
);

// Top navigation — navy in both modes
const TopNav = ({ currentUser, onAvatarClick, theme, onThemeToggle, isMobile, onOpenNotifications, onOpenMobileMenu, bellRef, searchWrapperRef, searchQuery, onSearchQuery, onSearchFocus, notifUnread, searchChildren, screen }) => {
  const onProfile = screen === 'profile';
  return (
  <header style={{
    background: 'var(--nav-navy)',
    color: '#fff',
    height: isMobile ? 56 : 68,
    display: 'flex', alignItems: 'center',
    padding: isMobile ? '0 12px 0 8px' : '0 32px',
    gap: isMobile ? 8 : 16,
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    position: 'sticky', top: 0, zIndex: 40,
  }}>
    {isMobile && (
      <button aria-label="Open menu" onClick={onOpenMobileMenu} style={{width:40,height:40,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>
        <Icon name="menu"/>
      </button>
    )}
    <Brand compact={isMobile}/>
    {!isMobile && <div style={{flex:1}}/>}
    {!isMobile && (
      <div ref={searchWrapperRef} style={{position:'relative', width: 360}}>
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          background:'rgba(255,255,255,0.06)', borderRadius:10,
          padding:'8px 12px', color:'rgba(255,255,255,0.7)',
          border:'1px solid transparent', transition:'border-color 160ms ease-out, background-color 160ms ease-out',
        }}
        onFocusCapture={(e) => { e.currentTarget.style.borderColor='rgba(200,169,110,0.4)'; e.currentTarget.style.background='rgba(255,255,255,0.1)'; }}
        onBlurCapture={(e) => { e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}>
          <Icon name="search" size={16}/>
          <input
            placeholder="Search people, rewards, activities…"
            value={searchQuery}
            onChange={(e)=>onSearchQuery(e.target.value)}
            onFocus={onSearchFocus}
            style={{background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:13, width:'100%'}}
          />
          {searchQuery
            ? <button onClick={()=>onSearchQuery('')} style={{color:'rgba(255,255,255,0.55)', padding:2, borderRadius:4}}><Icon name="x" size={13}/></button>
            : <span style={{fontSize:11, opacity:0.5, border:'1px solid rgba(255,255,255,0.2)', padding:'1px 6px', borderRadius:4}}>⌘K</span>}
        </div>
        {searchChildren}
      </div>
    )}
    {isMobile && <div style={{flex:1}}/>}
    <button ref={bellRef} onClick={onOpenNotifications} aria-label="Notifications" style={{width:40,height:40,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',position:'relative'}}>
      <Icon name="bell"/>
      {notifUnread > 0 && (
        <span className="num" style={{position:'absolute', top:4, right:3, minWidth:16, height:16, padding:'0 4px', borderRadius:999, background:'var(--accent-gold)', color:'var(--nav-navy)', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 0 2px var(--nav-navy)'}}>{notifUnread > 9 ? '9+' : notifUnread}</span>
      )}
    </button>
    {!isMobile && <ThemeToggle theme={theme} onToggle={onThemeToggle}/>}
    <button
      onClick={onProfile ? undefined : onAvatarClick}
      style={{display:'flex', alignItems:'center', gap:10, padding:4, borderRadius:999, cursor: onProfile ? 'default' : 'pointer'}}
    >
      <Avatar initials={currentUser.avatarInitials} tone="gold" size={36}/>
      {!isMobile && (
        <div style={{textAlign:'left', paddingRight:8}}>
          <div style={{fontSize:13, fontWeight:600, lineHeight:1.2}}>{currentUser.name.split(' ')[0]}</div>
          <div className="num" style={{fontSize:11, opacity:0.65, lineHeight:1.2}}>{currentUser.balance.toLocaleString()} pts</div>
        </div>
      )}
    </button>
  </header>
  );
};

// Brand mark — award medallion (recognition/merit icon, non-typographic)
const Brand = ({ compact }) => (
  <div style={{display:'flex', alignItems:'center', gap:10}}>
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-label="SkillLane Merit">
      {/* ribbon tails behind medal */}
      <path d="M10 18 L7.5 29 L12 26 L14 22 Z" fill="var(--accent-gold)" opacity="0.55"/>
      <path d="M22 18 L24.5 29 L20 26 L18 22 Z" fill="var(--accent-gold)" opacity="0.85"/>
      {/* outer medallion */}
      <circle cx="16" cy="14" r="9.5" fill="none" stroke="var(--accent-gold)" strokeWidth="1.4"/>
      {/* inner rim */}
      <circle cx="16" cy="14" r="7.2" fill="none" stroke="var(--accent-gold)" strokeWidth="0.7" opacity="0.55"/>
      {/* centered star — symbol of merit */}
      <path
        d="M16 9.2 L17.45 12.45 L21 12.85 L18.35 15.25 L19.1 18.7 L16 16.95 L12.9 18.7 L13.65 15.25 L11 12.85 L14.55 12.45 Z"
        fill="var(--accent-gold)"
      />
    </svg>
    {!compact && (
      <div style={{lineHeight:1}}>
        <div style={{fontSize:15, fontWeight:600, letterSpacing:'-0.01em'}}>SkillLane <span style={{fontWeight:400, opacity:0.7}}>Merit</span></div>
      </div>
    )}
  </div>
);

// Sidebar — desktop only
const Sidebar = ({ screen, setScreen, isAdmin }) => {
  const items = [
    { id: 'dashboard',    label: 'Dashboard',      icon: 'home' },
    { id: 'history',      label: 'My Activities',  icon: 'history' },
    { id: 'leaderboard',  label: 'Leaderboard',    icon: 'medal' },
    { id: 'rewards',      label: 'Rewards',        icon: 'gift' },
    { id: 'feed',         label: 'Recognition',    icon: 'sparkles' },
    { id: 'profile',      label: 'My Profile',     icon: 'user' },
  ];
  const adminItems = [
    { id: 'approve',      label: 'Approvals',      icon: 'send' },
    { id: 'reports',      label: 'Reports',        icon: 'chart' },
  ];
  const Item = ({ it }) => {
    const active = screen === it.id;
    return (
      <button
        onClick={active ? undefined : () => setScreen(it.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          width: '100%', padding: '11px 14px',
          borderRadius: 10, fontSize: 14, fontWeight: 500,
          color: active ? 'var(--text)' : 'var(--text-muted)',
          background: active ? 'var(--surface-elevated)' : 'transparent',
          boxShadow: active ? 'var(--shadow-card)' : 'none',
          transition: 'all 200ms ease-out',
          position: 'relative',
          cursor: active ? 'default' : 'pointer',
        }}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        {active && <div style={{position:'absolute', left:-16, top:10, bottom:10, width:3, background:'var(--accent-gold)', borderRadius:2}}/>}
        <Icon name={it.icon} size={18}/>
        <span>{it.label}</span>
      </button>
    );
  };
  return (
    <nav style={{
      width: 240, padding: '28px 16px',
      flexShrink: 0,
      borderRight: '1px solid var(--border)',
      background: 'var(--surface-nav)',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{padding:'0 14px 12px'}} className="t-label muted">Personal</div>
      {items.map(it => <Item key={it.id} it={it}/>)}
      {isAdmin && (
        <>
          <div style={{padding:'20px 14px 12px', display:'flex', alignItems:'center', gap:8}} className="t-label muted">
            <Icon name="shield" size={12}/> Manager
          </div>
          {adminItems.map(it => <Item key={it.id} it={it}/>)}
        </>
      )}
      <div style={{flex:1}}/>
      <div style={{
        padding: 16, borderRadius: 12, background: 'var(--surface)',
        border: '1px solid var(--border-soft)', marginTop: 16,
      }}>
        <div className="t-label muted" style={{marginBottom:6}}>Year ends</div>
        <div style={{fontSize:15, fontWeight:600}}>Dec 31 · <span className="num muted">{Math.round((new Date(new Date().getFullYear(), 11, 31) - new Date()) / 86400000)} days</span></div>
        <div className="t-body-sm muted" style={{marginTop:6}}>Wallet resets on Jan 1. Use your points!</div>
      </div>
    </nav>
  );
};

// Mobile tab bar — bottom
const MobileTabs = ({ screen, setScreen, isAdmin }) => {
  const base = [
    { id: 'dashboard',   label: 'Home',        icon: 'home' },
    { id: 'history',     label: 'Activities',  icon: 'history' },
    { id: 'feed',        label: 'Recognition', icon: 'sparkles' },
    { id: 'rewards',     label: 'Rewards',     icon: 'gift' },
    { id: 'profile',     label: 'Profile',     icon: 'user' },
  ];
  const items = isAdmin
    ? [...base, { id: 'approve', label: 'Approve', icon: 'send' }]
    : base;
  return (
    <nav style={{
      position: 'sticky', bottom: 0, zIndex: 40,
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {items.map(it => {
        const active = screen === it.id;
        return (
          <button key={it.id} onClick={active ? undefined : () => setScreen(it.id)} style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:4,
            padding:'10px 4px', fontSize:10.5, fontWeight:500,
            color: active ? 'var(--text)' : 'var(--text-subtle)',
            position:'relative',
            cursor: active ? 'default' : 'pointer',
          }}>
            {active && <div style={{position:'absolute', top:0, left:'30%', right:'30%', height:2, background:'var(--accent-gold)', borderRadius:'0 0 2px 2px'}}/>}
            <Icon name={it.icon} size={20}/>
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// Rank chip — understated, not gamey
const RankChip = ({ rank }) => {
  const styles = {
    1: { bg: 'color-mix(in oklch, var(--accent-gold) 22%, transparent)', color: 'var(--accent-gold)', ring: 'var(--accent-gold)' },
    2: { bg: 'color-mix(in oklch, #C0C8D4 25%, transparent)',            color: '#9AA5B5',             ring: '#9AA5B5' },
    3: { bg: 'color-mix(in oklch, #B08968 22%, transparent)',            color: '#B08968',             ring: '#B08968' },
  };
  const style = styles[rank];
  if (style) {
    return (
      <div className="num" style={{
        width: 30, height: 30, borderRadius: 8,
        display:'flex', alignItems:'center', justifyContent:'center',
        background: style.bg, color: style.color,
        boxShadow: `inset 0 0 0 1px ${style.ring}`,
        fontWeight: 600, fontSize: 13,
      }}>{rank}</div>
    );
  }
  return (
    <div className="num muted" style={{
      width: 30, height: 30, display:'flex', alignItems:'center', justifyContent:'center',
      fontWeight: 500, fontSize: 13,
    }}>{rank}</div>
  );
};

// Shared category-icon mapping used in transaction rows
const categoryIcon = (cat) => {
  if (/shipped|work|launch/i.test(cat)) return 'sparkles';
  if (/peer/i.test(cat))                return 'sparkles';
  if (/redeem|reward/i.test(cat))       return 'gift';
  if (/milestone|anniversary/i.test(cat))return 'medal';
  if (/above/i.test(cat))               return 'arrow-up';
  return 'coin';
};

Object.assign(window, {
  Icon, CoinGlyph, Avatar, ThemeToggle, TopNav, Brand, Sidebar, MobileTabs, RankChip, categoryIcon
});
