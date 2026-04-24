// Recognition Feed — social-style, with composer
const FeedScreen = ({ data, isMobile }) => {
  const toast = useToast();
  const [posts, setPosts] = React.useState(data.recognitions);
  const [draft, setDraft] = React.useState('');
  const [recipient, setRecipient] = React.useState(data.recipients[0]);
  const [category, setCategory] = React.useState('Peer recognition');
  const [amount, setAmount] = React.useState(50);
  const [search, setSearch] = React.useState('');
  const [stateMode, setStateMode] = React.useState('normal');
  const [submitError, setSubmitError] = React.useState(null);

  const submit = () => {
    if (!draft.trim()) return;
    if (draft.trim().length < 10) {
      const err = {title:'Message is too short', body:'Please write at least 10 characters so the recognition carries context.'};
      setSubmitError(err);
      toast.error(err.title, err.body);
      return;
    }
    setSubmitError(null);
    const newPost = {
      id: 'rec' + Date.now(),
      fromName: data.currentUser.name, fromInitials: data.currentUser.avatarInitials,
      toName: recipient.name, toInitials: recipient.initials,
      message: draft,
      category, amount,
      reactions: {},
      when: 'just now',
      fresh: true,
    };
    setPosts([newPost, ...posts]);
    setDraft('');
    toast.success(
      `Recognition sent to ${recipient.name.split(' ')[0]}`,
      `${amount} points · ${category}. It's now visible on the feed.`
    );
  };

  const visible = stateMode === 'empty' ? [] :
    search ? posts.filter(p => (p.message + ' ' + p.fromName + ' ' + p.toName).toLowerCase().includes(search.toLowerCase())) : posts;

  return (
    <div className="fade-in" style={{padding: isMobile?'20px 16px 32px':'40px 48px 80px', maxWidth: 900, margin:'0 auto'}}>
      <ScreenHeader
        eyebrow="Peer-to-peer" title="Recognition"
        desc="See how colleagues are acknowledging one another. Send your own — small recognitions compound."
        searchValue={search} onSearch={setSearch} searchPlaceholder="Search recognitions by name or keyword…"
        stateMode={stateMode} onStateModeChange={setStateMode}
      />

      {stateMode === 'loading' ? (
        <SkeletonFeed isMobile={isMobile} noWrapper/>
      ) : stateMode === 'error' ? (
        <div className="card" style={{padding:20}}>
          <PageError title="We couldn't load the feed" body="The recognition feed isn't responding. Give it a moment and try again." onRetry={()=>setStateMode('normal')}/>
        </div>
      ) : (<>
      {/* Composer */}
      <div className="card" style={{padding: isMobile?20:28, marginBottom: 24}}>
        <div style={{display:'flex', gap:14, alignItems:'flex-start'}}>
          <Avatar initials={data.currentUser.avatarInitials} tone="gold" size={40}/>
          <div style={{flex:1}}>
            <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:12}}>
              <span className="t-body-sm muted">Recognize</span>
              <select value={recipient.id} onChange={e=>setRecipient(data.recipients.find(p=>p.id===e.target.value))} className="input" style={{width:'auto', padding:'6px 10px', fontSize:13, fontWeight:500}}>
                {data.recipients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <span className="t-body-sm muted">for</span>
              <select value={category} onChange={e=>setCategory(e.target.value)} className="input" style={{width:'auto', padding:'6px 10px', fontSize:13, fontWeight:500}}>
                {['Peer recognition','Shipped work','Above & beyond','Mentorship'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <textarea
              value={draft}
              onChange={e=>setDraft(e.target.value)}
              placeholder="Be specific — recognition lands when it's concrete."
              rows={3}
              className="input"
              style={{resize:'vertical', minHeight:80, fontSize:14, lineHeight:1.55}}
            />
            {!draft.trim() && (
              <div className="t-caption muted" style={{marginTop:6, fontSize:12}}>
                Tag a specific action or outcome — concrete beats vague every time.
              </div>
            )}
            {draft.trim().length > 0 && draft.trim().length < 10 && (
              <div className="t-caption" style={{marginTop:6, fontSize:12, color:'var(--error)'}}>
                At least 10 characters required ({draft.trim().length}/10)
              </div>
            )}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14, gap:12, flexWrap:'wrap'}}>
              <div style={{display:'flex', gap:6}}>
                {[25, 50, 100, 200].map(v => (
                  <button key={v} onClick={()=>setAmount(v)} style={{
                    display:'flex', alignItems:'center', gap:4,
                    padding:'7px 12px', borderRadius:999, fontSize:13, fontWeight:600,
                    background: amount===v ? 'color-mix(in oklch, var(--accent-gold) 18%, transparent)' : 'var(--surface-muted)',
                    color: amount===v ? 'var(--accent-gold)' : 'var(--text-muted)',
                    border: `1px solid ${amount===v ? 'color-mix(in oklch, var(--accent-gold) 40%, transparent)' : 'var(--border-soft)'}`,
                  }}>
                    <CoinGlyph size={12}/> {v}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary" onClick={submit} disabled={!draft.trim()} style={{opacity: draft.trim()?1:0.4}}>
                Send recognition <Icon name="send" size={14}/>
              </button>
            </div>
            {submitError && <div style={{marginTop:10}}><ErrorBanner title={submitError.title} body={submitError.body} onDismiss={()=>setSubmitError(null)}/></div>}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div style={{display:'flex', flexDirection:'column', gap: 16}}>
        {visible.map(p => <RecognitionPost key={p.id} post={p}/>)}
        {visible.length === 0 && (
          <div className="card">
            {search ? (
              <EmptyState kind="search" title={`No recognitions match "${search}"`} body="Try a different name or keyword." actions={[<button key="c" className="btn btn-ghost" onClick={()=>setSearch('')}>Clear search</button>]}/>
            ) : (
              <EmptyState kind="feed" title="The feed is quiet" body="Be the first to recognize a colleague this week. A few thoughtful words go a long way." />
            )}
          </div>
        )}
      </div>
      </>)}
    </div>
  );
};

const EMOJIS = ['👏', '🙏', '🔥', '❤️', '🎯'];

const RecognitionPost = ({ post }) => {
  const [reactions, setReactions] = React.useState(post.reactions);
  const [mine, setMine] = React.useState(new Set());
  const react = (em) => {
    setReactions(r => {
      const next = { ...r };
      if (mine.has(em)) {
        next[em] = (next[em] || 1) - 1;
        if (!next[em]) delete next[em];
        setMine(new Set([...mine].filter(x => x !== em)));
      } else {
        next[em] = (next[em] || 0) + 1;
        setMine(new Set([...mine, em]));
      }
      return next;
    });
  };

  return (
    <article className="card fade-in" style={{padding: 24}}>
      <div style={{display:'flex', gap:14, alignItems:'flex-start'}}>
        <Avatar initials={post.fromInitials} size={44} tone="navy"/>
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:'flex', alignItems:'center', flexWrap:'wrap', gap:6, fontSize:14.5}}>
            <strong style={{fontWeight:600}}>{post.fromName}</strong>
            <span className="muted">→</span>
            <strong style={{fontWeight:600}}>{post.toName}</strong>
            <span className="chip chip-gold" style={{marginLeft:4, padding:'3px 9px', fontSize:11}}>
              <CoinGlyph size={11}/>+{post.amount}
            </span>
          </div>
          <div className="t-caption muted" style={{marginTop:2, display:'flex', gap:8, alignItems:'center'}}>
            <span>{post.category}</span>
            <span style={{width:2, height:2, borderRadius:'50%', background:'var(--text-subtle)'}}/>
            <span>{post.when}</span>
          </div>
          <p style={{margin:'14px 0 0', fontSize:15, lineHeight:1.6, color:'var(--text)', textWrap:'pretty'}}>{post.message}</p>

          <div style={{display:'flex', gap:6, marginTop:16, flexWrap:'wrap'}}>
            {EMOJIS.map(em => {
              const count = reactions[em] || 0;
              const mineHas = mine.has(em);
              if (count === 0 && !mineHas) return (
                <button key={em} onClick={()=>react(em)} style={{
                  width:32, height:32, borderRadius:999, fontSize:14,
                  border:'1px solid var(--border-soft)',
                  background:'var(--surface)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  opacity:0.6, transition:'all 150ms ease-out',
                }}
                onMouseEnter={e=>e.currentTarget.style.opacity=1}
                onMouseLeave={e=>e.currentTarget.style.opacity=0.6}
                >{em}</button>
              );
              return (
                <button key={em} onClick={()=>react(em)} style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'6px 12px', borderRadius:999,
                  fontSize:13, fontWeight:500,
                  border: `1px solid ${mineHas ? 'color-mix(in oklch, var(--accent-gold) 40%, transparent)' : 'var(--border-soft)'}`,
                  background: mineHas ? 'color-mix(in oklch, var(--accent-gold) 14%, transparent)' : 'var(--surface-muted)',
                  color: mineHas ? 'var(--accent-gold)' : 'var(--text-muted)',
                  transition:'all 150ms ease-out',
                }}>
                  <span style={{fontSize:14}}>{em}</span>
                  <span className="num">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
};

Object.assign(window, { FeedScreen });
