// Points History — chronological with filters
const HistoryScreen = ({ data, isMobile }) => {
  const toast = useToast();
  const { activity, categories } = data;
  const [category, setCategory] = React.useState('All');
  const [sign, setSign] = React.useState('all'); // all | earned | redeemed
  const [range, setRange] = React.useState('90d');
  const [search, setSearch] = React.useState('');
  const [stateMode, setStateMode] = React.useState('normal');
  const [exporting, setExporting] = React.useState(false);

  const handleExport = () => {
    if (exporting) return;
    setExporting(true);
    setTimeout(() => {
      const headers = ['Date', 'Description', 'From', 'Category', 'Points'];
      const rows = filtered.map(tx => [
        tx.date,
        `"${(tx.note  || '').replace(/"/g, '""')}"`,
        `"${(tx.from  || '').replace(/"/g, '""')}"`,
        tx.category,
        tx.amount,
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'merit-history.csv'; a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
      toast.success(`${filtered.length} transactions exported`, 'merit-history.csv downloaded to your Downloads folder.');
    }, 650);
  };

  const clearAllFilters = () => {
    setSearch(''); setCategory('All'); setSign('all'); setRange('90d');
    toast.info('Filters cleared', 'Showing all transactions on your account.', { duration: 2200 });
  };

  const filtered = activity.filter(tx => {
    if (stateMode === 'empty') return false;
    if (category !== 'All' && tx.category !== category) return false;
    if (sign === 'earned'   && tx.amount < 0) return false;
    if (sign === 'redeemed' && tx.amount > 0) return false;
    if (search && !(tx.note + ' ' + tx.from + ' ' + tx.category).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalEarned  = filtered.filter(t => t.amount > 0).reduce((a,b)=>a+b.amount,0);
  const totalRedeem  = filtered.filter(t => t.amount < 0).reduce((a,b)=>a+b.amount,0);
  const net = totalEarned + totalRedeem;

  return (
    <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth: 1280, margin:'0 auto'}}>
      <ScreenHeader
        eyebrow="Activity" title="Points history"
        desc="Every merit transaction on your account, filterable by category and direction."
        searchValue={search} onSearch={setSearch} searchPlaceholder="Search by description, sender, or category…"
        stateMode={stateMode} onStateModeChange={setStateMode}
      />

      {stateMode === 'loading' ? (
        <SkeletonHistory isMobile={isMobile} noWrapper/>
      ) : stateMode === 'error' ? (
        <div className="card" style={{padding:20}}>
          <PageError
            title="We couldn't load your ledger"
            body="The activity service didn't respond. Check your connection and try again."
            onRetry={()=>setStateMode('normal')}
          />
        </div>
      ) : (<>
      {/* Summary strip */}
      <div style={{display:'grid', gridTemplateColumns: isMobile?'repeat(3, 1fr)':'repeat(3, minmax(0,1fr))', gap: isMobile?10:16, marginBottom:24}}>
        <SummaryStat label="Earned" value={`+${totalEarned.toLocaleString()}`} accent="success"/>
        <SummaryStat label="Redeemed" value={totalRedeem.toLocaleString()} />
        <SummaryStat label="Net" value={`${net>0?'+':''}${net.toLocaleString()}`} accent={net>=0?'gold':'muted'}/>
      </div>

      {/* Filter bar */}
      <div className="card" style={{padding: isMobile?16:20, marginBottom:16, display:'flex', flexWrap:'wrap', gap:12, alignItems:'center'}}>
        <div style={{display:'flex', alignItems:'center', gap:8}} className="muted">
          <Icon name="filter" size={16}/>
          <span className="t-label">Filter</span>
        </div>
        <FilterGroup
          value={sign} onChange={setSign}
          options={[{v:'all', l:'All'}, {v:'earned', l:'Earned'}, {v:'redeemed', l:'Redeemed'}]}
        />
        <div style={{width:1, height:20, background:'var(--border)'}}/>
        <select value={category} onChange={e=>setCategory(e.target.value)} className="input" style={{width:'auto', padding:'8px 12px', fontSize:13}}>
          <option>All</option>
          {categories.map(c => <option key={c}>{c}</option>)}
          <option>Reward</option>
        </select>
        <select value={range} onChange={e=>setRange(e.target.value)} className="input" style={{width:'auto', padding:'8px 12px', fontSize:13}}>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="ytd">Year to date</option>
          <option value="all">All time</option>
        </select>
        <div style={{flex:1}}/>
        {(search || category !== 'All' || sign !== 'all') && (
          <button onClick={clearAllFilters} className="btn btn-ghost" style={{padding:'8px 14px', fontSize:13}}>Clear filters</button>
        )}
        <button onClick={handleExport} disabled={exporting} className="btn btn-ghost" style={{padding:'8px 14px', fontSize:13, opacity: exporting ? 0.6 : 1}}>
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {/* Ledger */}
      <div className="card" style={{padding: filtered.length === 0 ? 0 : (isMobile?'8px 16px':'8px 28px')}}>
        {filtered.map((tx, i) => (
          <HistoryRow key={tx.id} tx={tx} last={i === filtered.length - 1} isMobile={isMobile}/>
        ))}
        {filtered.length === 0 && (
          search ? (
            <EmptyState kind="search"
              title={`No results for "${search}"`}
              body="Try a different term, or clear the filters above to broaden your search."
              actions={[<button key="c" className="btn btn-ghost" onClick={()=>{setSearch(''); setCategory('All'); setSign('all');}}>Clear all filters</button>]}
            />
          ) : (
            <EmptyState kind="history"
              title="No transactions yet"
              body="Once you earn or redeem merit, your history will appear here. Send a recognition to get things moving."
            />
          )
        )}
      </div>
      </>)}
    </div>
  );
};

const SummaryStat = ({ label, value, accent }) => (
  <div className="card" style={{padding:18}}>
    <div className="t-label muted">{label}</div>
    <div className="num" style={{
      fontSize: 24, fontWeight: 600, letterSpacing:'-0.015em', marginTop:6,
      color: accent==='success' ? 'var(--success)' : accent==='gold' ? 'var(--accent-gold)' : accent==='muted' ? 'var(--text-muted)' : 'var(--text)'
    }}>{value}</div>
  </div>
);

const FilterGroup = ({ value, onChange, options }) => (
  <div style={{display:'flex', gap:2, padding:2, background:'var(--surface-muted)', borderRadius:8, border:'1px solid var(--border-soft)'}}>
    {options.map(o => (
      <button key={o.v} onClick={()=>onChange(o.v)} style={{
        padding:'6px 12px', fontSize:13, fontWeight:500,
        borderRadius:6,
        background: value === o.v ? 'var(--surface)' : 'transparent',
        color: value === o.v ? 'var(--text)' : 'var(--text-muted)',
        boxShadow: value === o.v ? '0 1px 2px rgba(11,30,61,0.06)' : 'none',
        transition:'all 150ms ease-out',
      }}>{o.l}</button>
    ))}
  </div>
);

const HistoryRow = ({ tx, last, isMobile }) => {
  const positive = tx.amount > 0;
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns: isMobile ? '40px 1fr auto' : '44px 1fr 160px 110px',
      gap: isMobile ? 12 : 16, alignItems:'center',
      padding: isMobile ? '14px 0' : '18px 0',
      borderBottom: last ? 'none' : '1px solid var(--border-soft)',
    }}>
      <div style={{
        width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, borderRadius:10,
        background:'var(--surface-muted)',
        display:'flex', alignItems:'center', justifyContent:'center',
        color:'var(--text-muted)',
      }}><Icon name={categoryIcon(tx.category)} size={isMobile ? 14 : 16}/></div>
      <div style={{minWidth:0}}>
        <div style={{fontSize: isMobile ? 13.5 : 14.5, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace: isMobile ? 'nowrap' : 'normal'}}>{tx.note}</div>
        <div className="t-caption muted" style={{marginTop:4, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
          <span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth: isMobile ? 120 : 'none'}}>{tx.from}</span>
          {!isMobile && <span className="chip" style={{padding:'2px 8px', fontSize:11}}>{tx.category}</span>}
          {isMobile && <span className="num">· {tx.date}</span>}
        </div>
      </div>
      {!isMobile && <div className="t-caption muted num" style={{textAlign:'right'}}>{tx.date}</div>}
      <div className="num" style={{
        fontSize: isMobile ? 14.5 : 16, fontWeight:600, textAlign:'right',
        color: positive ? 'var(--success)' : 'var(--text-muted)',
        whiteSpace:'nowrap',
      }}>{positive?'+':''}{tx.amount.toLocaleString()}</div>
    </div>
  );
};

Object.assign(window, { HistoryScreen });
