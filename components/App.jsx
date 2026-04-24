// Main App
const SCREENS = ['dashboard', 'history', 'rewards', 'leaderboard', 'feed', 'profile', 'editprofile', 'approve', 'reports'];

const DesktopShell = ({ data, screen, setScreen, theme, setTheme, onSignOut, notifOpen, setNotifOpen, bellRef, searchWrapperRef, searchQuery, setSearchQuery, searchOpen, setSearchOpen }) => {
  const screenMap = {
    dashboard:   <Dashboard         data={data} setScreen={setScreen} isMobile={false}/>,
    history:     <HistoryScreen     data={data} isMobile={false}/>,
    rewards:     <RewardsScreen     data={data} isMobile={false}/>,
    leaderboard: <LeaderboardScreen data={data} isMobile={false}/>,
    feed:        <FeedScreen        data={data} isMobile={false}/>,
    profile:     <ProfileScreen     data={data} setScreen={setScreen} isMobile={false}/>,
    editprofile: <EditProfileScreen data={data} setScreen={setScreen} isMobile={false}/>,
    approve:     <AwardScreen       data={data} setScreen={setScreen} isMobile={false}/>,
    reports:     <TeamDashboard     data={data} setScreen={setScreen} isMobile={false}/>,
  };
  const unreadCount = (data.notifications || []).filter(n => n.unread).length;
  return (
    <div style={{minHeight:'100%', display:'flex', flexDirection:'column', background:'var(--bg)', color:'var(--text)'}}>
      <TopNav
        currentUser={data.currentUser} theme={theme}
        onThemeToggle={() => setTheme(theme==='dark'?'light':'dark')}
        onAvatarClick={()=>setScreen('profile')}
        onOpenNotifications={() => setNotifOpen(o => !o)}
        bellRef={bellRef} searchWrapperRef={searchWrapperRef}
        searchQuery={searchQuery} onSearchQuery={setSearchQuery}
        onSearchFocus={() => setSearchOpen(true)}
        notifUnread={unreadCount}
        searchChildren={
          <SearchPopover
            open={searchOpen}
            query={searchQuery}
            onClose={() => { setSearchOpen(false); setSearchQuery(''); }}
            setScreen={setScreen}
            isAdmin={data.currentUser.isAdmin}
          />
        }
      />
      <div style={{display:'flex', flex:1, minHeight:0}}>
        <Sidebar screen={screen} setScreen={setScreen} isAdmin={data.currentUser.isAdmin}/>
        <main key={screen} style={{flex:1, minWidth:0, overflow:'auto'}}>
          {screenMap[screen]}
        </main>
      </div>
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} anchorRef={bellRef} isMobile={false}/>
    </div>
  );
};

const MobileShell = ({ data, screen, setScreen, theme, setTheme, onSignOut, notifOpen, setNotifOpen, menuOpen, setMenuOpen, drawerScope = 'viewport' }) => {
  const screenMap = {
    dashboard:   <Dashboard      data={data} setScreen={setScreen} isMobile={true}/>,
    history:     <HistoryScreen  data={data} isMobile={true}/>,
    rewards:     <RewardsScreen  data={data} isMobile={true}/>,
    leaderboard: <LeaderboardScreen data={data} isMobile={true}/>,
    feed:        <FeedScreen        data={data} isMobile={true}/>,
    profile:     <ProfileScreen     data={data} setScreen={setScreen} isMobile={true}/>,
    editprofile: <EditProfileScreen data={data} setScreen={setScreen} isMobile={true}/>,
    approve:     <AwardScreen       data={data} setScreen={setScreen} isMobile={true}/>,
    reports:     <TeamDashboard     data={data} setScreen={setScreen} isMobile={true}/>,
  };
  const unreadCount = (data.notifications || []).filter(n => n.unread).length;
  return (
    <div style={{minHeight:'100%', display:'flex', flexDirection:'column', background:'var(--bg)', color:'var(--text)', position:'relative'}}>
      <TopNav
        currentUser={data.currentUser} theme={theme}
        onThemeToggle={() => setTheme(theme==='dark'?'light':'dark')}
        onAvatarClick={()=>setScreen('profile')} isMobile
        onOpenNotifications={() => setNotifOpen(true)}
        onOpenMobileMenu={() => setMenuOpen(true)}
        notifUnread={unreadCount}
      />
      <main key={screen} style={{flex:1, minWidth:0, overflow:'auto'}}>
        {screenMap[screen]}
      </main>
      <MobileTabs screen={screen} setScreen={setScreen} isAdmin={data.currentUser.isAdmin}/>

      {/* Overlays render inside the mobile shell so they clip to the phone frame */}
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} isMobile={true}/>
      <MobileMenuDrawer
        open={menuOpen} onClose={() => setMenuOpen(false)}
        screen={screen} setScreen={setScreen} isAdmin={data.currentUser.isAdmin}
        currentUser={data.currentUser} theme={theme}
        onThemeToggle={() => setTheme(theme==='dark'?'light':'dark')}
        onSignOut={onSignOut}
        scope={drawerScope}
      />
    </div>
  );
};

// Mobile viewport — renders inside a 375px phone-like device frame with chrome
const MobileFrame = ({ children }) => (
  <div style={{
    width: 392, height: 820, flexShrink: 0,
    borderRadius: 44, padding: 8,
    background: '#0a0f1a',
    boxShadow: '0 30px 80px rgba(11,30,61,0.28), 0 10px 30px rgba(11,30,61,0.2), inset 0 0 0 1.5px rgba(255,255,255,0.08)',
    position:'relative',
  }}>
    <div style={{
      width:'100%', height:'100%',
      borderRadius: 36, overflow:'hidden',
      background:'var(--bg)',
      position:'relative',
    }}>
      {/* Status bar */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:44, zIndex:50,
        background:'var(--nav-navy)', color:'#fff',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 28px', fontSize:13, fontWeight:600,
      }}>
        <span className="num">9:41</span>
        <div style={{display:'flex', gap:5, alignItems:'center'}}>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 8h1M4 6h1M7 4h1M10 2h1M13 0h1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5a9 9 0 0112 0M3 7a6 6 0 018 0M5.5 9a2 2 0 013 0" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
          <svg width="22" height="10" viewBox="0 0 22 10" fill="none"><rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke="#fff" fill="none"/><rect x="2" y="2" width="13" height="6" rx="1" fill="#fff"/><rect x="19" y="3.5" width="2" height="3" rx="1" fill="#fff"/></svg>
        </div>
      </div>
      <div style={{position:'absolute', top:16, left:'50%', transform:'translateX(-50%)', width:104, height:26, background:'#0a0f1a', borderRadius:14, zIndex:60}}/>
      <div style={{paddingTop:44, height:'100%', display:'flex', flexDirection:'column', overflow:'hidden'}}>
        {children}
      </div>
    </div>
  </div>
);

// Main shell — handles viewport switching, theme persistence
const useViewportAuto = () => {
  // Track the browser's actual width so we can auto-switch to mobile layout at <768px
  const [w, setW] = React.useState(() => typeof window === 'undefined' ? 1280 : window.innerWidth);
  React.useEffect(() => {
    const onR = () => setW(window.innerWidth);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  return {
    width: w,
    isNarrow: w < 768,      // true mobile territory — swap to phone shell
    isTablet: w >= 768 && w < 1024,
    isDesktop: w >= 1024,
  };
};

const App = () => {
  const baseData = window.MERIT_DATA;
  const [activeUser, setActiveUser] = React.useState(
    () => window.MERIT_USERS[localStorage.getItem('sklm.email') || 'thitichaya.c@skilllane.com']
         || window.MERIT_USERS['thitichaya.c@skilllane.com']
  );
  const data = { ...baseData, currentUser: activeUser };
  const toast = useToast();
  const vpAuto = useViewportAuto();
  const [screen,  setScreenRaw]  = React.useState(() => localStorage.getItem('sklm.screen')  || 'dashboard');
  const [theme,   setThemeRaw]   = React.useState(() => localStorage.getItem('sklm.theme')   || 'light');
  const [vpPref,  setVpRaw]      = React.useState(() => localStorage.getItem('sklm.vp')      || 'auto');
  const [authed,  setAuthed]     = React.useState(() => localStorage.getItem('sklm.authed')  !== 'false');
  const [tokensOpen, setTokensOpen] = React.useState(false);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);
  const [fading, setFading] = React.useState(false);

  // Overlay state — notifications panel, search popover, mobile menu drawer
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const bellRef = React.useRef(null);
  const searchWrapperRef = React.useRef(null);

  // Close search popover on outside click
  React.useEffect(() => {
    if (!searchOpen) return;
    const onDown = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [searchOpen]);

  // Close overlays on Escape (menu/notif only — search is handled by wrapper)
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setNotifOpen(false); setMenuOpen(false); setSearchOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Resolved viewport: 'auto' → follow real window; otherwise honor explicit choice
  const vp = vpPref === 'auto' ? (vpAuto.isNarrow ? 'mobile' : 'desktop') : vpPref;

  const setScreen = (s) => { setScreenRaw(s); localStorage.setItem('sklm.screen', s); };
  const setVp = (v) => { setVpRaw(v); localStorage.setItem('sklm.vp', v); };
  const setAuth = (a) => { setAuthed(a); localStorage.setItem('sklm.authed', a ? 'true' : 'false'); };

  // Theme with cross-fade + toast
  const setTheme = (t) => {
    setFading(true);
    setTimeout(() => {
      setThemeRaw(t);
      localStorage.setItem('sklm.theme', t);
      setTimeout(() => setFading(false), 160);
    }, 10);
    toast.info(
      t === 'dark' ? 'Dark mode enabled' : 'Light mode enabled',
      'Your preference has been saved.',
      { duration: 2200 }
    );
  };

  const handleSignIn = (email) => {
    const user = window.MERIT_USERS[email] || window.MERIT_USERS['thitichaya.c@skilllane.com'];
    setActiveUser(user);
    localStorage.setItem('sklm.email', email);
    setAuth(true);
    setTimeout(() => {
      toast.success(
        `Welcome back, ${user.firstName}`,
        `You have ${user.balance.toLocaleString()} merit points available.`
      );
    }, 200);
  };

  const handleSignOut = () => {
    localStorage.removeItem('sklm.email');
    setAuth(false);
    toast.info('Signed out', 'Your session ended. Sign in again anytime.', { duration: 2600 });
  };

  React.useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  // Keyboard shortcuts. Global listeners; ignored when typing in inputs.
  React.useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // Help overlay — ? (shift+/) or /
      if (e.key === '?' || e.key === '/') { e.preventDefault(); setShortcutsOpen(o => !o); return; }
      if (e.key === 'Escape') { setShortcutsOpen(false); setTokensOpen(false); return; }
      if (e.key === 't' || e.key === 'T') setTheme(theme === 'dark' ? 'light' : 'dark');
      if (e.key === 'v' || e.key === 'V') setVp(vp === 'desktop' ? 'mobile' : 'desktop');
      // Nav: 1..7 jump to screens
      const navMap = { '1':'dashboard','2':'history','3':'rewards','4':'leaderboard','5':'approve','6':'reports' };
      if (navMap[e.key]) { if (!data.currentUser.isAdmin && (e.key==='5'||e.key==='6')) return; setScreen(navMap[e.key]); }
      // g for tokens (Settings-ish)
      if (e.key === ',') setTokensOpen(o => !o);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [theme, vp]);

  if (!authed) {
    return (
      <div className={fading ? 'theme-fade' : ''} style={{minHeight:'100vh', background:'var(--bg)', color:'var(--text)'}}>
        {vp === 'desktop'
          ? <LoginScreen onSignIn={handleSignIn} theme={theme}/>
          : <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding: vpAuto.isNarrow ? 0 : '40px 20px'}}>
              {vpAuto.isNarrow
                ? <div style={{width:'100%', minHeight:'100vh'}}><LoginScreenMobile onSignIn={handleSignIn}/></div>
                : <MobileFrame><LoginScreenMobile onSignIn={handleSignIn}/></MobileFrame>
              }
            </div>
        }
        <MetaBar vp={vpPref} setVp={setVp} onTokens={() => setTokensOpen(true)} onSignOut={null} authed={false} vpAuto={vpAuto}/>
      </div>
    );
  }

  // When window is actually narrow, render the mobile shell directly (no frame), edge-to-edge
  const renderAsRealMobile = vpAuto.isNarrow && vpPref === 'auto';

  return (
    <div className={fading ? 'theme-fade' : ''} style={{
      minHeight:'100vh',
      background: (vp==='mobile' && !renderAsRealMobile) ? (theme==='dark' ? '#0a1729' : '#E6EAF1') : 'var(--bg)',
      color:'var(--text)',
    }}>
      {vp === 'desktop' ? (
        <div style={{minHeight:'100vh'}}>
          <DesktopShell
            data={data} screen={screen} setScreen={setScreen}
            theme={theme} setTheme={setTheme}
            notifOpen={notifOpen} setNotifOpen={setNotifOpen} bellRef={bellRef}
            searchWrapperRef={searchWrapperRef}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            searchOpen={searchOpen} setSearchOpen={setSearchOpen}
          />
        </div>
      ) : renderAsRealMobile ? (
        <div style={{minHeight:'100vh'}}>
          <MobileShell
            data={data} screen={screen} setScreen={setScreen}
            theme={theme} setTheme={setTheme}
            onSignOut={handleSignOut}
            notifOpen={notifOpen} setNotifOpen={setNotifOpen}
            menuOpen={menuOpen} setMenuOpen={setMenuOpen}
            drawerScope="viewport"
          />
        </div>
      ) : (
        <div style={{
          minHeight:'100vh',
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:'40px 20px 100px',
          background: theme === 'dark'
            ? 'radial-gradient(ellipse at top, #162D52 0%, #0B1E3D 60%)'
            : 'radial-gradient(ellipse at top, #E6EAF1 0%, #D6DBE4 70%)',
        }}>
          <MobileFrame>
            <MobileShell
              data={data} screen={screen} setScreen={setScreen}
              theme={theme} setTheme={setTheme}
              onSignOut={handleSignOut}
              notifOpen={notifOpen} setNotifOpen={setNotifOpen}
              menuOpen={menuOpen} setMenuOpen={setMenuOpen}
              drawerScope="frame"
            />
          </MobileFrame>
        </div>
      )}

      <MetaBar vp={vpPref} setVp={setVp} onTokens={() => setTokensOpen(true)} onSignOut={handleSignOut} authed={true} vpAuto={vpAuto} onShortcuts={() => setShortcutsOpen(true)}/>
      <TokensPanel open={tokensOpen} onClose={()=>setTokensOpen(false)} theme={theme} setTheme={setTheme}/>
      <ShortcutsPanel open={shortcutsOpen} onClose={()=>setShortcutsOpen(false)} isAdmin={data.currentUser.isAdmin}/>
    </div>
  );
};

// Floating meta bar — lets reviewer switch viewport, open tokens, sign out
const MetaBar = ({ vp, setVp, onTokens, onSignOut, authed, vpAuto, onShortcuts }) => {
  // On real narrow viewports we collapse the bar into a single pill to avoid
  // overlapping the app's own mobile tab bar.
  const [open, setOpen] = React.useState(false);
  const compact = vpAuto && vpAuto.isNarrow;

  if (compact && !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open preview controls"
        style={{
          position:'fixed', bottom: authed ? 80 : 20, right: 16, zIndex: 90,
          width: 44, height: 44, borderRadius: '50%',
          background:'rgba(9,23,41,0.92)', color:'#fff',
          backdropFilter:'blur(10px)',
          boxShadow:'0 10px 30px rgba(11,30,61,0.3)',
          border:'1px solid rgba(255,255,255,0.08)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}
      >
        <Icon name="sparkles" size={18}/>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: compact ? (authed ? 80 : 20) : 16,
      left: compact ? 12 : '50%',
      right: compact ? 12 : 'auto',
      transform: compact ? 'none' : 'translateX(-50%)',
      zIndex: 90,
      background: 'rgba(9, 23, 41, 0.92)',
      backdropFilter: 'blur(10px)',
      borderRadius: compact ? 14 : 999,
      padding: compact ? 8 : 6,
      display:'flex', alignItems:'center',
      gap: compact ? 4 : 6,
      flexWrap: compact ? 'wrap' : 'nowrap',
      boxShadow:'0 14px 40px rgba(11,30,61,0.3)',
      border:'1px solid rgba(255,255,255,0.06)',
      color:'#fff',
      maxWidth: compact ? 'none' : undefined,
      justifyContent: compact ? 'space-between' : 'flex-start',
    }}>
      <div style={{padding:'4px 12px', fontSize:11, fontWeight:600, color:'var(--accent-gold)', letterSpacing:'0.08em', textTransform:'uppercase'}}>Preview</div>
      {!compact && <div style={{width:1, height:16, background:'rgba(255,255,255,0.12)'}}/>}
      <ViewportSwitcher vp={vp} setVp={setVp}/>
      {!compact && <div style={{width:1, height:16, background:'rgba(255,255,255,0.12)'}}/>}
      <button onClick={onTokens} style={{padding:'6px 10px', borderRadius:6, fontSize:12, fontWeight:500, color:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', gap:6}}>
        <Icon name="sparkles" size={13}/> Tokens
      </button>
      {onShortcuts && (
        <>
          {!compact && <div style={{width:1, height:16, background:'rgba(255,255,255,0.12)'}}/>}
          <button onClick={onShortcuts} style={{padding:'6px 10px', borderRadius:6, fontSize:12, fontWeight:500, color:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', gap:6}} title="Keyboard shortcuts (?)">
            <kbd style={{fontFamily:'ui-monospace,monospace', fontSize:11, padding:'1px 5px', borderRadius:4, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)'}}>?</kbd> Shortcuts
          </button>
        </>
      )}
      {authed && (
        <>
          {!compact && <div style={{width:1, height:16, background:'rgba(255,255,255,0.12)'}}/>}
          <button onClick={onSignOut} style={{padding:'6px 10px', borderRadius:6, fontSize:12, fontWeight:500, color:'rgba(255,255,255,0.55)'}}>
            Sign out
          </button>
        </>
      )}
      {compact && (
        <button onClick={() => setOpen(false)} aria-label="Close preview controls" style={{padding:'6px 8px', borderRadius:6, color:'rgba(255,255,255,0.55)'}}>
          <Icon name="x" size={14}/>
        </button>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <App/>
  </ToastProvider>
);
