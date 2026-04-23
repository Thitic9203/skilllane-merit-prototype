// Rewards Catalog — card grid
const RewardsScreen = ({ data, isMobile }) => {
  const { rewards, currentUser } = data;
  const toast = useToast();
  const [cat, setCat] = React.useState('All');
  const [sort, setSort] = React.useState('featured');
  const [redeemed, setRedeemed] = React.useState({});
  const [search, setSearch] = React.useState('');
  const [stateMode, setStateMode] = React.useState('normal');

  const handleRedeem = (r) => {
    // Simulate occasional out-of-stock error for demo realism
    if (r.id && r.id.endsWith && r.id.endsWith('9')) {
      toast.error("Couldn't redeem right now", `"${r.title}" is temporarily out of stock. Try again later.`);
      return;
    }
    setRedeemed(s => ({ ...s, [r.id]: true }));
    toast.success(`Redeemed · ${r.title}`, `${r.cost.toLocaleString()} points were deducted. People Ops will fulfill within 3 business days.`);
  };

  const categories = ['All', 'Office', 'Wellness', 'Growth', 'Tech', 'Experience', 'Time', 'Give back'];
  let list = cat === 'All' ? rewards : rewards.filter(r => r.category === cat);
  if (search) list = list.filter(r => (r.title + ' ' + r.category).toLowerCase().includes(search.toLowerCase()));
  if (sort === 'low')  list = [...list].sort((a,b) => a.cost - b.cost);
  if (sort === 'high') list = [...list].sort((a,b) => b.cost - a.cost);
  if (stateMode === 'empty') list = [];

  return (
    <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth: 1280, margin:'0 auto'}}>
      <ScreenHeader
        eyebrow="Catalog" title="Rewards"
        desc="Spend earned merit on things that matter. Orders are fulfilled by People Ops within 3 business days."
        right={
          <div className="card" style={{padding:'14px 20px', display:'flex', alignItems:'center', gap:14}}>
            <CoinGlyph size={22}/>
            <div>
              <div className="t-caption muted">Available</div>
              <div className="num" style={{fontSize:22, fontWeight:600, letterSpacing:'-0.015em'}}>{currentUser.balance.toLocaleString()}</div>
            </div>
          </div>
        }
        searchValue={search} onSearch={setSearch} searchPlaceholder="Search rewards by name or category…"
        stateMode={stateMode} onStateModeChange={setStateMode}
      />

      {stateMode === 'loading' ? (
        <SkeletonRewards isMobile={isMobile} noWrapper/>
      ) : stateMode === 'error' ? (
        <div className="card" style={{padding:20}}>
          <PageError title="Rewards catalog is unavailable" body="We couldn't reach the rewards service. Your balance is safe — please try again in a moment." onRetry={()=>setStateMode('normal')}/>
        </div>
      ) : (<>
      {/* Category tabs */}
      <div style={{display:'flex', gap:8, overflowX:'auto', paddingBottom:4, marginBottom:16}}>
        {categories.map(c => (
          <button key={c} onClick={()=>setCat(c)} style={{
            padding:'8px 14px', borderRadius:999, fontSize:13, fontWeight:500,
            whiteSpace:'nowrap',
            background: cat === c ? 'var(--nav-navy)' : 'var(--surface)',
            color: cat === c ? '#fff' : 'var(--text-muted)',
            border: cat === c ? '1px solid var(--nav-navy)' : '1px solid var(--border)',
            transition:'all 200ms ease-out',
          }}>{c}</button>
        ))}
        <div style={{flex:1}}/>
        {!isMobile && (
          <select value={sort} onChange={e=>setSort(e.target.value)} className="input" style={{width:'auto', padding:'8px 12px', fontSize:13}}>
            <option value="featured">Sort: Featured</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
          </select>
        )}
      </div>

      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {list.map(r => (
          <RewardCard key={r.id} r={r} balance={currentUser.balance} redeemed={!!redeemed[r.id]} onRedeem={() => handleRedeem(r)}/>
        ))}
      </div>
      {list.length === 0 && (
        <div className="card" style={{marginTop:16}}>
          {search ? (
            <EmptyState kind="search"
              title={`No rewards match "${search}"`}
              body="Try another term, or explore a different category above."
              actions={[<button key="c" className="btn btn-ghost" onClick={()=>{setSearch(''); setCat('All');}}>Reset filters</button>]}
            />
          ) : (
            <EmptyState kind="rewards"
              title="Nothing available in this category"
              body="New rewards are added each quarter. Check back soon, or browse other categories."
              actions={[<button key="a" className="btn btn-ghost" onClick={()=>setCat('All')}>Browse all rewards</button>]}
            />
          )}
        </div>
      )}
      </>)}
    </div>
  );
};

const RewardCard = ({ r, balance, redeemed, onRedeem }) => {
  const canAfford = balance >= r.cost;
  const [hover, setHover] = React.useState(false);
  return (
    <article
      className="card"
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        overflow:'hidden', display:'flex', flexDirection:'column',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transition: 'transform 250ms ease-out, box-shadow 250ms ease-out',
      }}>
      <div className="stripe-ph" style={{
        aspectRatio: '1.4 / 1',
        position: 'relative',
      }}>
        <span>{r.category} · product shot</span>
        {r.tag && (
          <span className="chip chip-gold" style={{position:'absolute', top:12, left:12, padding:'5px 10px'}}>{r.tag}</span>
        )}
      </div>
      <div style={{padding:20, display:'flex', flexDirection:'column', gap:12, flex:1}}>
        <div className="t-label muted">{r.category}</div>
        <h3 style={{fontSize:16, fontWeight:600, lineHeight:1.35, margin:0}}>{r.title}</h3>
        <div style={{flex:1}}/>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, paddingTop:10, borderTop:'1px solid var(--border-soft)'}}>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <CoinGlyph size={18}/>
            <div>
              <div className="num" style={{fontSize:17, fontWeight:600, letterSpacing:'-0.01em'}}>{r.cost.toLocaleString()}</div>
              <div className="t-caption muted" style={{marginTop:0}}>{r.stock}</div>
            </div>
          </div>
          <button
            onClick={!redeemed && canAfford ? onRedeem : undefined}
            disabled={!canAfford || redeemed}
            style={{
              padding:'10px 14px', borderRadius:8, fontSize:13, fontWeight:600,
              background: redeemed ? 'color-mix(in oklch, var(--success) 14%, transparent)' : canAfford ? 'var(--nav-navy)' : 'var(--surface-muted)',
              color: redeemed ? 'var(--success)' : canAfford ? '#fff' : 'var(--text-subtle)',
              cursor: canAfford && !redeemed ? 'pointer' : 'default',
              border: 'none',
              display:'flex', alignItems:'center', gap:6,
              transition: 'all 200ms ease-out',
            }}
          >
            {redeemed ? (<><Icon name="check" size={14}/> Redeemed</>)
              : canAfford ? 'Redeem'
              : `Need ${(r.cost-balance).toLocaleString()}`}
          </button>
        </div>
      </div>
    </article>
  );
};

Object.assign(window, { RewardsScreen });
