// Overlays — Notifications panel, Search popover, Mobile menu drawer
// All three mount at root level and sit over the app chrome.

const Backdrop = ({ onClose, zIndex = 70, opacity = 0.32 }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed', inset: 0, zIndex,
      background: `rgba(6, 14, 28, ${opacity})`,
      backdropFilter: 'blur(2px)',
      animation: 'fadeUp 180ms ease-out',
    }}
  />
);

// ─────────────────────────────────────────────────────────────
// Notifications Panel
// ─────────────────────────────────────────────────────────────
const notifIconFor = (kind) => {
  switch (kind) {
    case 'recognition': return 'sparkles';
    case 'redemption':  return 'gift';
    case 'reaction':    return 'sparkles';
    case 'badge':       return 'medal';
    case 'system':      return 'bell';
    default:            return 'bell';
  }
};

const NotificationRow = ({ n, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', textAlign: 'left',
      display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: '14px 16px',
      borderRadius: 10,
      background: n.unread ? 'color-mix(in oklch, var(--accent-gold) 7%, transparent)' : 'transparent',
      transition: 'background-color 160ms ease-out',
      position: 'relative',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = n.unread
      ? 'color-mix(in oklch, var(--accent-gold) 12%, transparent)'
      : 'var(--surface-muted)'}
    onMouseLeave={(e) => e.currentTarget.style.background = n.unread
      ? 'color-mix(in oklch, var(--accent-gold) 7%, transparent)'
      : 'transparent'}
  >
    <div style={{position: 'relative', flexShrink: 0}}>
      <Avatar initials={n.fromInitials} tone={n.fromTone || 'navy'} size={36}/>
      <div style={{
        position: 'absolute', right: -3, bottom: -3,
        width: 16, height: 16, borderRadius: '50%',
        background: 'color-mix(in oklch, var(--accent-gold) 18%, var(--surface))',
        border: '2px solid var(--surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--accent-gold)',
      }}>
        <Icon name={notifIconFor(n.kind)} size={9}/>
      </div>
    </div>
    <div style={{flex: 1, minWidth: 0, paddingRight: n.unread ? 14 : 0}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'space-between'}}>
        <div style={{fontSize: 13.5, fontWeight: n.unread ? 600 : 500, color: 'var(--text)', lineHeight: 1.4, letterSpacing: '-0.005em'}}>
          {n.title}
        </div>
        <div className="num" style={{fontSize: 11, color: 'var(--text-subtle)', flexShrink: 0, whiteSpace: 'nowrap'}}>{n.when}</div>
      </div>
      <div className="muted" style={{marginTop: 3, lineHeight: 1.5, fontSize: 13, textWrap: 'pretty',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
        {n.body}
      </div>
      {n.amount && (
        <div style={{marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 999,
          background: 'color-mix(in oklch, var(--accent-gold) 15%, transparent)', color: 'var(--accent-gold)',
          fontSize: 11.5, fontWeight: 600, border: '1px solid color-mix(in oklch, var(--accent-gold) 28%, transparent)'}}>
          <CoinGlyph size={11}/>
          <span className="num">+{n.amount}</span>
          <span style={{opacity: 0.7, fontWeight: 500}}>· {n.category}</span>
        </div>
      )}
    </div>
    {n.unread && <div style={{position: 'absolute', right: 10, top: 18, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-gold)'}}/>}
  </button>
);

const NotificationsPanel = ({ open, onClose, anchorRef, isMobile, allRead = false, onMarkAllRead }) => {
  const data = window.MERIT_DATA;
  const [tab, setTab] = React.useState('all');
  const [mode, setMode] = React.useState('normal'); // normal | empty
  const panelRef = React.useRef(null);

  React.useEffect(() => { if (open) setTab('all'); }, [open]);

  React.useEffect(() => {
    if (!open || isMobile) return;
    const onDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) &&
          anchorRef?.current && !anchorRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, isMobile]);

  if (!open) return null;

  const all = data.notifications || [];
  const unread = (allRead || mode === 'empty') ? [] : all.filter(n => n.unread);
  const shownRaw = mode === 'empty' ? [] : (tab === 'unread' ? unread : all);
  const shown = allRead ? shownRaw.map(n => ({ ...n, unread: false })) : shownRaw;
  const today = shown.filter(n => n.group === 'today');
  const earlier = shown.filter(n => n.group !== 'today');

  const header = (
    <div style={{padding: '14px 16px 12px', borderBottom: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', gap: 12}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <h2 style={{margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em'}}>Notifications</h2>
          {unread.length > 0 && mode !== 'empty' && (
            <span className="num" style={{padding: '1px 7px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'var(--accent-gold)', color: 'var(--nav-navy)'}}>{unread.length}</span>
          )}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
          <button
            onClick={() => setMode(mode === 'empty' ? 'normal' : 'empty')}
            title={mode === 'empty' ? 'Show notifications' : 'Preview empty state'}
            style={{fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: 6, color: 'var(--text-subtle)', border: '1px dashed var(--border)'}}
          >{mode === 'empty' ? 'Normal' : 'Empty'}</button>
          {isMobile && (
            <button onClick={onClose} aria-label="Close" style={{width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'}}>
              <Icon name="x" size={18}/>
            </button>
          )}
        </div>
      </div>
      <div style={{display: 'flex', gap: 2, padding: 2, background: 'var(--surface-muted)', borderRadius: 8, border: '1px solid var(--border-soft)', alignSelf: 'flex-start'}}>
        {[{v:'all', l:'All', count:all.length}, {v:'unread', l:'Unread', count:unread.length}].map(o => (
          <button key={o.v} onClick={() => setTab(o.v)} style={{
            padding: '5px 12px', fontSize: 12.5, fontWeight: 500, borderRadius: 6,
            background: tab===o.v ? 'var(--surface)' : 'transparent',
            color: tab===o.v ? 'var(--text)' : 'var(--text-muted)',
            boxShadow: tab===o.v ? '0 1px 2px rgba(11,30,61,0.06)' : 'none',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {o.l}<span className="num" style={{opacity: tab===o.v ? 0.7 : 0.55, fontSize: 11}}>{o.count}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const list = (
    <div style={{flex: 1, minHeight: 0, overflow: 'auto', padding: '8px 8px 6px'}}>
      {shown.length === 0 ? (
        <div style={{padding: '28px 24px 40px'}}>
          <EmptyState
            compact
            kind="search"
            title={tab === 'unread' ? "You're all caught up" : 'No notifications yet'}
            body={tab === 'unread'
              ? 'No unread messages. Check back later or browse your recent activity.'
              : 'Recognitions, redemptions and team updates will show up here.'}
          />
        </div>
      ) : (
        <>
          {today.length > 0 && (
            <>
              <div className="t-label muted" style={{padding: '8px 12px 4px'}}>Today</div>
              {today.map(n => <NotificationRow key={n.id} n={n} onClick={onClose}/>)}
            </>
          )}
          {earlier.length > 0 && (
            <>
              <div className="t-label muted" style={{padding: '14px 12px 4px'}}>Earlier</div>
              {earlier.map(n => <NotificationRow key={n.id} n={n} onClick={onClose}/>)}
            </>
          )}
        </>
      )}
    </div>
  );

  const footer = (
    <div style={{padding: '10px 16px', borderTop: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-muted)'}}>
      <button
        disabled={unread.length === 0 || mode === 'empty'}
        onClick={() => { if (onMarkAllRead) onMarkAllRead(); setTab('all'); }}
        style={{fontSize: 12.5, fontWeight: 500, padding: '6px 8px', borderRadius: 6,
          color: (unread.length === 0 || mode === 'empty') ? 'var(--text-subtle)' : 'var(--text)',
          cursor: (unread.length === 0 || mode === 'empty') ? 'not-allowed' : 'pointer'}}
      >Mark all as read</button>
      <button
        onClick={onClose}
        style={{fontSize: 12.5, fontWeight: 600, color: 'var(--accent-gold)', padding: '6px 8px', borderRadius: 6}}
      >Open inbox →</button>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Backdrop onClose={onClose} zIndex={70}/>
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 71,
          background: 'var(--surface)',
          borderRadius: '20px 20px 0 0',
          maxHeight: '85%', display: 'flex', flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
          animation: 'sheetUp 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        }}>
          <div style={{padding: '8px 0', display: 'flex', justifyContent: 'center'}}>
            <div style={{width: 38, height: 4, borderRadius: 2, background: 'var(--border)'}}/>
          </div>
          {header}
          {list}
          {footer}
        </div>
      </>
    );
  }

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed', top: 62, right: 84, zIndex: 71,
        width: 400, maxHeight: 'min(620px, calc(100vh - 100px))',
        display: 'flex', flexDirection: 'column',
        background: 'var(--surface)',
        borderRadius: 16,
        boxShadow: '0 20px 50px rgba(11, 30, 61, 0.18), 0 2px 8px rgba(11,30,61,0.08)',
        border: '1px solid var(--border-soft)',
        animation: 'panelIn 180ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        overflow: 'hidden',
      }}
      role="dialog"
      aria-label="Notifications"
    >
      <div style={{position: 'absolute', top: -6, right: 26, width: 12, height: 12,
        background: 'var(--surface)', borderLeft: '1px solid var(--border-soft)', borderTop: '1px solid var(--border-soft)',
        transform: 'rotate(45deg)'}}/>
      {header}
      {list}
      {footer}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Search Popover
// ─────────────────────────────────────────────────────────────
const SearchResultRow = ({ icon, primary, secondary, meta, rightIcon, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px', borderRadius: 8,
      transition: 'background-color 120ms ease-out',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-muted)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    <div style={{width: 32, height: 32, borderRadius: 8, background: 'var(--surface-muted)', border: '1px solid var(--border-soft)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0}}>
      {icon}
    </div>
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{fontSize: 13.5, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{primary}</div>
      {secondary && <div className="muted" style={{fontSize: 12, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{secondary}</div>}
    </div>
    {meta && <div className="num muted" style={{fontSize: 11.5, flexShrink: 0}}>{meta}</div>}
    {rightIcon && <div style={{color: 'var(--text-subtle)', flexShrink: 0}}>{rightIcon}</div>}
  </button>
);

const SearchPopover = ({ open, query, onClose, setScreen, setQuery, isAdmin }) => {
  const data = window.MERIT_DATA;
  const [recentSearches, setRecentSearches] = React.useState(
    () => (data.searchSuggestions?.recent || [])
  );
  if (!open) return null;
  const q = query.trim().toLowerCase();

  const people = q ? data.leaderboard.filter(p => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q)).slice(0, 4) : [];
  const rewards = q ? data.rewards.filter(r => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)).slice(0, 4) : [];
  const activity = q ? data.activity.filter(a => a.note.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.activityName?.toLowerCase().includes(q)).slice(0, 3) : [];
  const hasResults = people.length + rewards.length + activity.length > 0;
  const quickActions = (data.searchSuggestions?.quickActions || []).filter(qa => !qa.admin || isAdmin);

  const go = (screen) => { setScreen(screen); onClose(); };

  return (
    <div
      style={{
        position: 'absolute', top: 'calc(100% + 10px)', left: 0, right: 0,
        background: 'var(--surface)',
        borderRadius: 14,
        boxShadow: '0 20px 50px rgba(11, 30, 61, 0.22), 0 2px 8px rgba(11,30,61,0.1)',
        border: '1px solid var(--border-soft)',
        color: 'var(--text)',
        maxHeight: 'min(520px, calc(100vh - 120px))',
        overflow: 'auto',
        animation: 'panelIn 180ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        zIndex: 60,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {!q ? (
        <>
          <div style={{padding: '12px 14px 4px'}} className="t-label muted">Quick actions</div>
          <div style={{padding: '0 6px 6px'}}>
            {quickActions.map(qa => (
              <SearchResultRow key={qa.id}
                icon={<Icon name={qa.icon} size={16}/>}
                primary={qa.label}
                rightIcon={<Icon name="arrow-right" size={14}/>}
                onClick={() => go(qa.screen)}/>
            ))}
          </div>
          <div style={{height: 1, background: 'var(--border-soft)', margin: '4px 14px'}}/>
          <div style={{padding: '12px 14px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div className="t-label muted">Recent searches</div>
            <button
              onClick={() => setRecentSearches([])}
              style={{fontSize: 11.5, fontWeight: 500, color: 'var(--text-subtle)', padding: 2, borderRadius: 4}}
            >Clear</button>
          </div>
          <div style={{padding: '0 6px 10px'}}>
            {recentSearches.map((r, i) => (
              <SearchResultRow key={i}
                icon={<Icon name="history" size={15}/>}
                primary={r}
                rightIcon={<span style={{fontSize: 10.5, fontWeight: 500, color: 'var(--text-subtle)'}}>↵</span>}
                onClick={() => { if (setQuery) setQuery(r); }}/>
            ))}
          </div>
          <div style={{padding: '10px 14px', borderTop: '1px solid var(--border-soft)', background: 'var(--surface-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--text-subtle)'}}>
            <span>Search teammates, rewards, activities</span>
            <span style={{display: 'flex', gap: 4}}>
              <kbd style={{fontFamily: 'ui-monospace,monospace', fontSize: 10.5, padding: '1px 5px', borderRadius: 4, background: 'var(--surface)', border: '1px solid var(--border)'}}>↑</kbd>
              <kbd style={{fontFamily: 'ui-monospace,monospace', fontSize: 10.5, padding: '1px 5px', borderRadius: 4, background: 'var(--surface)', border: '1px solid var(--border)'}}>↓</kbd>
              <kbd style={{fontFamily: 'ui-monospace,monospace', fontSize: 10.5, padding: '1px 5px', borderRadius: 4, background: 'var(--surface)', border: '1px solid var(--border)'}}>↵</kbd>
            </span>
          </div>
        </>
      ) : !hasResults ? (
        <div style={{padding: '28px 20px 36px'}}>
          <EmptyState compact kind="search"
            title={`No results for "${query}"`}
            body="Try another keyword, or browse the rewards catalog or leaderboard."
            actions={[
              <button key="r" className="btn btn-ghost" onClick={() => go('rewards')} style={{fontSize: 13, padding: '8px 14px'}}>Browse rewards</button>,
              <button key="l" className="btn btn-ghost" onClick={() => go('leaderboard')} style={{fontSize: 13, padding: '8px 14px'}}>Leaderboard</button>,
            ]}/>
        </div>
      ) : (
        <>
          {people.length > 0 && (
            <>
              <div style={{padding: '12px 14px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div className="t-label muted">People</div><span className="muted" style={{fontSize: 11}}>{people.length}</span>
              </div>
              <div style={{padding: '0 6px 6px'}}>
                {people.map(p => (
                  <SearchResultRow key={p.name}
                    icon={<Avatar initials={p.initials} size={28} tone={p.isYou ? 'gold' : 'navy'}/>}
                    primary={<span>{p.name}{p.isYou && <span className="muted" style={{fontWeight: 400, marginLeft: 6}}>· you</span>}</span>}
                    secondary={p.team}
                    meta={<span>#{p.rank} · <span style={{fontWeight: 600, color: 'var(--text-muted)'}}>{p.points.toLocaleString()}</span> pts</span>}
                    onClick={() => go('leaderboard')}/>
                ))}
              </div>
            </>
          )}
          {rewards.length > 0 && (
            <>
              <div style={{padding: '12px 14px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div className="t-label muted">Rewards</div><span className="muted" style={{fontSize: 11}}>{rewards.length}</span>
              </div>
              <div style={{padding: '0 6px 6px'}}>
                {rewards.map(r => (
                  <SearchResultRow key={r.id}
                    icon={<Icon name="gift" size={16}/>}
                    primary={r.title}
                    secondary={`${r.category} · ${r.stock}`}
                    meta={<span className="num"><span style={{color: 'var(--accent-gold)', fontWeight: 600}}>{r.cost.toLocaleString()}</span> pts</span>}
                    onClick={() => go('rewards')}/>
                ))}
              </div>
            </>
          )}
          {activity.length > 0 && (
            <>
              <div style={{padding: '12px 14px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div className="t-label muted">Activity</div><span className="muted" style={{fontSize: 11}}>{activity.length}</span>
              </div>
              <div style={{padding: '0 6px 10px'}}>
                {activity.map(a => (
                  <SearchResultRow key={a.id}
                    icon={<Icon name={categoryIcon(a.category)} size={15}/>}
                    primary={a.note}
                    secondary={`${a.category} · ${a.date}`}
                    meta={<span className="num" style={{color: a.amount > 0 ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600}}>{a.amount > 0 ? '+' : ''}{a.amount}</span>}
                    onClick={() => go('history')}/>
                ))}
              </div>
            </>
          )}
          <div style={{padding: '10px 14px', borderTop: '1px solid var(--border-soft)', background: 'var(--surface-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--text-subtle)'}}>
            <span>{people.length + rewards.length + activity.length} results for <span style={{color: 'var(--text)', fontWeight: 500}}>"{query}"</span></span>
            <button onClick={() => go('history')} style={{fontSize: 12, fontWeight: 600, color: 'var(--accent-gold)', padding: '2px 6px', borderRadius: 4}}>See all →</button>
          </div>
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Mobile Menu Drawer
// ─────────────────────────────────────────────────────────────
const MobileMenuDrawer = ({ open, onClose, screen, setScreen, isAdmin, currentUser, theme, onThemeToggle, onSignOut, scope = 'viewport' }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const items = [
    { id: 'dashboard',    label: 'Dashboard',     icon: 'home',     desc: 'Your balance and activity' },
    { id: 'history',      label: 'My Activities', icon: 'history',  desc: 'Log, edit and track entries' },
    { id: 'leaderboard',  label: 'Leaderboard',   icon: 'medal',    desc: 'Rankings this month' },
    { id: 'rewards',      label: 'Rewards',       icon: 'gift',     desc: 'Catalog and redemptions' },
    { id: 'feed',         label: 'Recognition',   icon: 'sparkles', desc: 'Peer recognition feed' },
    { id: 'profile',      label: 'My Profile',    icon: 'user',     desc: 'Badges and summary' },
  ];
  const adminItems = [
    { id: 'approve',      label: 'Approvals',     icon: 'send',     desc: 'Review pending entries' },
    { id: 'reports',      label: 'Reports',       icon: 'chart',    desc: 'Team trends and top performers' },
    { id: 'settings',     label: 'Settings',      icon: 'settings', desc: 'Manage categories and activities' },
  ];

  const Item = ({ it }) => {
    const active = screen === it.id;
    return (
      <button
        onClick={() => { setScreen(it.id); onClose(); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          width: '100%', padding: '12px 14px',
          borderRadius: 12, fontSize: 14.5, fontWeight: 500, textAlign: 'left',
          color: active ? 'var(--text)' : 'var(--text-muted)',
          background: active ? 'var(--surface-elevated)' : 'transparent',
          boxShadow: active ? 'var(--shadow-card)' : 'none',
          position: 'relative',
          transition: 'background-color 160ms ease-out',
        }}
      >
        {active && <div style={{position: 'absolute', left: -18, top: 12, bottom: 12, width: 3, background: 'var(--accent-gold)', borderRadius: 2}}/>}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: active ? 'color-mix(in oklch, var(--accent-gold) 16%, transparent)' : 'var(--surface-muted)',
          border: active ? '1px solid color-mix(in oklch, var(--accent-gold) 30%, transparent)' : '1px solid var(--border-soft)',
          color: active ? 'var(--accent-gold)' : 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name={it.icon} size={18}/>
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontWeight: active ? 600 : 500}}>{it.label}</div>
          <div className="muted" style={{fontSize: 12, marginTop: 2, fontWeight: 400}}>{it.desc}</div>
        </div>
      </button>
    );
  };

  const positionStyle = scope === 'frame'
    ? { position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 76 }
    : { position: 'fixed',    left: 0, top: 0, bottom: 0, zIndex: 76 };

  return (
    <>
      <Backdrop onClose={onClose} zIndex={75}/>
      <aside
        style={{
          ...positionStyle,
          width: scope === 'frame' ? '86%' : 'min(320px, 86vw)',
          background: 'var(--surface)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '10px 0 40px rgba(0,0,0,0.18)',
          animation: 'drawerIn 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        }}
        role="dialog"
        aria-label="Main menu"
      >
        <div style={{padding: '18px 18px 16px', background: 'var(--nav-navy)', color: '#fff'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16}}>
            <Brand compact={false}/>
            <button onClick={onClose} aria-label="Close menu" style={{width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)'}}>
              <Icon name="x" size={20}/>
            </button>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <Avatar initials={currentUser.avatarInitials} tone="gold" size={48} ring/>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontSize: 15, fontWeight: 600, letterSpacing: '-0.005em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{currentUser.name}</div>
              <div style={{fontSize: 12, opacity: 0.65, marginTop: 2}}>{currentUser.role}</div>
            </div>
          </div>
          <div style={{marginTop: 14, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <div style={{fontSize: 11, opacity: 0.6, letterSpacing: '0.06em', textTransform: 'uppercase'}}>Balance</div>
              <div className="num" style={{fontSize: 18, fontWeight: 600, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6}}>
                <CoinGlyph size={14}/> {currentUser.balance.toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => { setScreen('rewards'); onClose(); }}
              style={{fontSize: 12, fontWeight: 600, padding: '7px 12px', borderRadius: 8, background: 'var(--accent-gold)', color: 'var(--nav-navy)'}}
            >Redeem →</button>
          </div>
        </div>

        <div style={{flex: 1, minHeight: 0, overflow: 'auto', padding: '14px 12px 6px'}}>
          <div className="t-label muted" style={{padding: '0 14px 8px'}}>Personal</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
            {items.map(it => <Item key={it.id} it={it}/>)}
          </div>
          {isAdmin && (
            <>
              <div className="t-label muted" style={{padding: '18px 14px 8px', display: 'flex', alignItems: 'center', gap: 6}}>
                <Icon name="shield" size={12}/> Manager
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
                {adminItems.map(it => <Item key={it.id} it={it}/>)}
              </div>
            </>
          )}
        </div>

        <div style={{padding: 12, borderTop: '1px solid var(--border-soft)', display: 'flex', gap: 8}}>
          <button
            onClick={onThemeToggle}
            style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 12px', borderRadius: 10,
              background: 'var(--surface-muted)', border: '1px solid var(--border-soft)', color: 'var(--text)', fontSize: 13, fontWeight: 500}}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16}/>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          {onSignOut && (
            <button
              onClick={() => { onSignOut(); onClose(); }}
              style={{padding: '10px 14px', borderRadius: 10, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13, fontWeight: 500}}
            >Sign out</button>
          )}
        </div>
      </aside>
    </>
  );
};

Object.assign(window, { NotificationsPanel, SearchPopover, MobileMenuDrawer });
