// Admin Settings — manage categories, activities, and point suggestions
const CATEGORY_COLORS = [
  '#C8A96E', '#8FB2D9', '#5FA37E', '#B8A7D1',
  '#C0C8D4', '#E05252', '#4DB6AC', '#F4A261',
];

const genId = (prefix) => prefix + '_' + Math.random().toString(36).slice(2, 8);

// Ensure every object has the required shape
const normalizeConfig = (cfg) => ({
  categories: (cfg.categories || []).map(cat => ({
    id: cat.id || genId('c'),
    name: cat.name || '',
    color: cat.color || CATEGORY_COLORS[0],
    archived: cat.archived || false,
    activities: (cat.activities || []).map(act => ({
      id: act.id || genId('a'),
      name: act.name || '',
      points: Number(act.points) || 0,
      archived: act.archived || false,
    })),
  })),
});

// Check if a category name appears in transaction history
const isCatUsed = (name) => {
  try { return (window.MERIT_DATA.activity || []).some(t => t.category === name); }
  catch { return false; }
};

// ── Colour swatch ──────────────────────────────────────────────────────────
const ColorPicker = ({ value, onChange }) => (
  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
    {CATEGORY_COLORS.map(c => (
      <button key={c} onClick={() => onChange(c)} style={{
        width:24, height:24, borderRadius:'50%', background:c,
        flexShrink:0, cursor:'pointer',
        border:'2px solid transparent',
        boxShadow: value === c ? `0 0 0 2px var(--accent-gold)` : 'none',
        transition:'box-shadow 100ms',
      }}/>
    ))}
  </div>
);

// ── Chevron SVG (no external icon needed) ─────────────────────────────────
const Chevron = ({ open }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    {open ? <path d="M2 8l4-4 4 4"/> : <path d="M2 4l4 4 4-4"/>}
  </svg>
);

// ── Activity row (view mode) ───────────────────────────────────────────────
const ActivityViewRow = ({ act, onEdit, onArchive, onDelete, isMobile }) => (
  <div style={{
    display:'flex', alignItems:'center', gap:8,
    padding:'9px 0', borderBottom:'1px solid var(--border-soft)',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
  }}>
    <div style={{ flex:1, fontSize:14, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
      {act.name || <span style={{ color:'var(--text-subtle)', fontStyle:'italic' }}>(unnamed)</span>}
    </div>
    <div className="num" style={{ fontSize:13, color:'var(--accent-gold)', fontWeight:600, flexShrink:0, whiteSpace:'nowrap' }}>
      {Number(act.points).toLocaleString()} pts
    </div>
    <button onClick={onEdit}
      style={{ padding:'4px 9px', borderRadius:6, fontSize:12, border:'1px solid var(--border-soft)', background:'var(--surface-muted)', color:'var(--text-muted)', cursor:'pointer', flexShrink:0 }}>
      Edit
    </button>
    <button onClick={onArchive}
      style={{ padding:'4px 9px', borderRadius:6, fontSize:12, border:'1px solid var(--border-soft)', background:'var(--surface-muted)', color:'var(--text-muted)', cursor:'pointer', flexShrink:0 }}>
      Archive
    </button>
  </div>
);

// ── Activity row (archived) ────────────────────────────────────────────────
const ActivityArchivedRow = ({ act, onRestore, onDelete }) => (
  <div style={{
    display:'flex', alignItems:'center', gap:8,
    padding:'9px 0', borderBottom:'1px solid var(--border-soft)', opacity:0.5,
    flexWrap:'wrap',
  }}>
    <div style={{ flex:1, fontSize:14, textDecoration:'line-through', color:'var(--text-muted)', minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
      {act.name || '(unnamed)'}
    </div>
    <div className="num" style={{ fontSize:13, color:'var(--text-subtle)', fontWeight:600, flexShrink:0 }}>
      {Number(act.points).toLocaleString()} pts
    </div>
    <span className="chip" style={{ padding:'2px 7px', fontSize:11, flexShrink:0 }}>archived</span>
    <button onClick={onRestore}
      style={{ padding:'4px 9px', borderRadius:6, fontSize:12, border:'1px solid var(--border-soft)', background:'var(--surface-muted)', color:'var(--text-muted)', cursor:'pointer', flexShrink:0 }}>
      Restore
    </button>
    <button onClick={onDelete}
      style={{ padding:'4px 9px', borderRadius:6, fontSize:12, border:'1px solid color-mix(in oklch, var(--error) 30%, transparent)', background:'color-mix(in oklch, var(--error) 8%, transparent)', color:'var(--error)', cursor:'pointer', flexShrink:0 }}>
      Delete
    </button>
  </div>
);

// ── Activity inline-edit form ─────────────────────────────────────────────
const ActivityEditForm = ({ act, allNames, onSave, onCancel }) => {
  const [name,   setName]   = React.useState(act.name);
  const [points, setPoints] = React.useState(act.points);
  const taken  = allNames.filter(n => n !== act.name).some(n => n.toLowerCase() === name.trim().toLowerCase());
  const canSave = name.trim().length > 0 && Number(points) > 0 && !taken;
  return (
    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', padding:'8px 0', borderBottom:'1px solid var(--border-soft)', flex:1 }}>
      <input value={name} onChange={e=>setName(e.target.value)} className="input"
        style={{ flex:1, minWidth:100, padding:'7px 10px', fontSize:13 }} placeholder="Activity name" autoFocus
        onKeyDown={e=>{ if(e.key==='Enter'&&canSave) onSave({name:name.trim(),points:Number(points)}); if(e.key==='Escape') onCancel(); }}
      />
      <input type="number" value={points} min={1} onChange={e=>setPoints(e.target.value)} className="input"
        style={{ width:78, padding:'7px 10px', fontSize:13 }} placeholder="pts"
      />
      <button className="btn btn-primary" onClick={()=>canSave&&onSave({name:name.trim(),points:Number(points)})}
        disabled={!canSave} style={{ padding:'7px 14px', fontSize:13, opacity:canSave?1:0.4 }}>Save</button>
      <button className="btn btn-ghost" onClick={onCancel} style={{ padding:'7px 10px', fontSize:13 }}>Cancel</button>
    </div>
  );
};

// ── Add activity form ──────────────────────────────────────────────────────
const AddActivityForm = ({ existingNames, onAdd, onCancel }) => {
  const [name,   setName]   = React.useState('');
  const [points, setPoints] = React.useState(50);
  const taken  = existingNames.some(n => n.toLowerCase() === name.trim().toLowerCase());
  const canAdd = name.trim().length > 0 && Number(points) > 0 && !taken;
  return (
    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', paddingTop:10 }}>
      <input value={name} onChange={e=>setName(e.target.value)} className="input"
        style={{ flex:1, minWidth:100, padding:'7px 10px', fontSize:13 }} placeholder="New activity name" autoFocus
        onKeyDown={e=>{ if(e.key==='Enter'&&canAdd) onAdd({name:name.trim(),points:Number(points)}); if(e.key==='Escape') onCancel(); }}
      />
      <input type="number" value={points} min={1} onChange={e=>setPoints(e.target.value)} className="input"
        style={{ width:78, padding:'7px 10px', fontSize:13 }} placeholder="pts"
      />
      <button className="btn btn-primary" onClick={()=>canAdd&&onAdd({name:name.trim(),points:Number(points)})}
        disabled={!canAdd} style={{ padding:'7px 14px', fontSize:13, opacity:canAdd?1:0.4 }}>Add</button>
      <button className="btn btn-ghost" onClick={onCancel} style={{ padding:'7px 10px', fontSize:13 }}>Cancel</button>
    </div>
  );
};

// ── Inline category edit ───────────────────────────────────────────────────
const CategoryEditForm = ({ cat, allNames, onSave, onCancel }) => {
  const [name,  setName]  = React.useState(cat.name);
  const [color, setColor] = React.useState(cat.color || CATEGORY_COLORS[0]);
  const taken  = allNames.filter(n => n !== cat.name).some(n => n.toLowerCase() === name.trim().toLowerCase());
  const canSave = name.trim().length > 0 && !taken;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      <input value={name} onChange={e=>setName(e.target.value)} className="input"
        style={{ padding:'8px 12px', fontSize:14 }} placeholder="Category name" autoFocus
        onKeyDown={e=>{ if(e.key==='Enter'&&canSave) onSave({name:name.trim(),color}); if(e.key==='Escape') onCancel(); }}
      />
      {taken && <div style={{ fontSize:12, color:'var(--error)' }}>That name is already in use</div>}
      <ColorPicker value={color} onChange={setColor}/>
      <div style={{ display:'flex', gap:8 }}>
        <button className="btn btn-primary" onClick={()=>canSave&&onSave({name:name.trim(),color})}
          disabled={!canSave} style={{ padding:'7px 16px', fontSize:13, opacity:canSave?1:0.4 }}>Save</button>
        <button className="btn btn-ghost" onClick={onCancel} style={{ padding:'7px 16px', fontSize:13 }}>Cancel</button>
      </div>
    </div>
  );
};

// ── Add category form ──────────────────────────────────────────────────────
const AddCategoryForm = ({ allNames, onAdd, onCancel }) => {
  const [name,  setName]  = React.useState('');
  const [color, setColor] = React.useState(CATEGORY_COLORS[0]);
  const taken  = allNames.some(n => n.toLowerCase() === name.trim().toLowerCase());
  const canAdd = name.trim().length > 0 && !taken;
  return (
    <div style={{
      background:'var(--surface)', border:'1px solid var(--accent-gold)',
      borderRadius:12, padding:'16px 20px', marginBottom:10,
    }}>
      <div className="t-label muted" style={{ marginBottom:10 }}>New category</div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <input value={name} onChange={e=>setName(e.target.value)} className="input"
          style={{ padding:'8px 12px', fontSize:14 }} placeholder="Category name" autoFocus
          onKeyDown={e=>{ if(e.key==='Enter'&&canAdd) onAdd({name:name.trim(),color}); if(e.key==='Escape') onCancel(); }}
        />
        {taken && <div style={{ fontSize:12, color:'var(--error)' }}>That name is already in use</div>}
        <ColorPicker value={color} onChange={setColor}/>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-primary" onClick={()=>canAdd&&onAdd({name:name.trim(),color})}
            disabled={!canAdd} style={{ padding:'7px 16px', fontSize:13, opacity:canAdd?1:0.4 }}>Add category</button>
          <button className="btn btn-ghost" onClick={onCancel} style={{ padding:'7px 16px', fontSize:13 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ── Reset confirm modal ────────────────────────────────────────────────────
const ResetConfirmModal = ({ onConfirm, onCancel }) => (
  <div style={{
    position:'fixed', inset:0, zIndex:300,
    background:'rgba(11,30,61,0.55)', backdropFilter:'blur(4px)',
    display:'flex', alignItems:'center', justifyContent:'center', padding:16,
  }} onClick={onCancel}>
    <div className="card" style={{ padding:28, maxWidth:380, width:'100%' }} onClick={e=>e.stopPropagation()}>
      <div style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>Reset to defaults?</div>
      <p className="t-body muted" style={{ lineHeight:1.55, marginBottom:20 }}>
        This overwrites all categories and activities with factory defaults. It cannot be undone.
      </p>
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={onConfirm}
          style={{ background:'var(--error)', borderColor:'var(--error)' }}>Reset</button>
      </div>
    </div>
  </div>
);

// ── Main screen ────────────────────────────────────────────────────────────
const SettingsScreen = ({ config: rawConfig, handleConfigChange, isMobile }) => {
  const toast = useToast();
  const config = React.useMemo(() => normalizeConfig(rawConfig || window.MERIT_CONFIG_DEFAULTS), [rawConfig]);

  const [expanded,       setExpanded]       = React.useState(new Set());
  const [editCatId,      setEditCatId]      = React.useState(null);
  const [editActKey,     setEditActKey]     = React.useState(null); // 'catId::actId'
  const [addActCatId,    setAddActCatId]    = React.useState(null);
  const [addingCat,      setAddingCat]      = React.useState(false);
  const [showArchived,   setShowArchived]   = React.useState(false);
  const [showResetModal, setShowResetModal] = React.useState(false);

  const save = React.useCallback((newCfg) => handleConfigChange(newCfg), [handleConfigChange]);

  const activeCats   = config.categories.filter(c => !c.archived);
  const archivedCats = config.categories.filter(c =>  c.archived);
  const allCatNames  = config.categories.map(c => c.name);

  const patchCats = (fn) => save({ ...config, categories: fn(config.categories) });
  const patchActs = (catId, fn) => patchCats(cats => cats.map(c => c.id === catId ? { ...c, activities: fn(c.activities) } : c));

  // Category ops
  const addCat = ({ name, color }) => {
    patchCats(cats => [...cats, { id:genId('c'), name, color, archived:false, activities:[] }]);
    setAddingCat(false);
    toast.success('Category added', `"${name}" is available in Award and Feed.`);
  };
  const updateCat = (id, patch) => {
    patchCats(cats => cats.map(c => c.id === id ? { ...c, ...patch } : c));
    setEditCatId(null);
    toast.success('Category updated', 'Changes saved.');
  };
  const archiveCat = (cat) => {
    patchCats(cats => cats.map(c => c.id === cat.id ? { ...c, archived:true } : c));
    toast.info('Category archived', `"${cat.name}" hidden from forms, kept in history.`);
  };
  const deleteCat = (cat) => {
    patchCats(cats => cats.filter(c => c.id !== cat.id));
    toast.success('Category deleted', `"${cat.name}" removed.`);
  };
  const restoreCat = (cat) => {
    patchCats(cats => cats.map(c => c.id === cat.id ? { ...c, archived:false } : c));
    toast.success('Category restored', `"${cat.name}" is active again.`);
  };

  // Activity ops
  const addAct = (catId, actData) => {
    patchActs(catId, acts => [...acts, { id:genId('a'), ...actData, archived:false }]);
    setAddActCatId(null);
    toast.success('Activity added', `"${actData.name}" · ${actData.points} pts`);
  };
  const updateAct = (catId, actId, patch) => {
    patchActs(catId, acts => acts.map(a => a.id === actId ? { ...a, ...patch } : a));
    setEditActKey(null);
    toast.success('Activity updated', 'Changes saved.');
  };
  const archiveAct = (catId, act) => {
    patchActs(catId, acts => acts.map(a => a.id === act.id ? { ...a, archived:true } : a));
    toast.info('Activity archived', `"${act.name}" hidden from new awards.`);
  };
  const deleteAct = (catId, act) => {
    patchActs(catId, acts => acts.filter(a => a.id !== act.id));
    toast.success('Activity deleted', `"${act.name}" removed.`);
  };
  const restoreAct = (catId, act) => {
    patchActs(catId, acts => acts.map(a => a.id === act.id ? { ...a, archived:false } : a));
    toast.success('Activity restored', `"${act.name}" active again.`);
  };

  const toggleExpand = (id) => setExpanded(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  // ── Category card ──────────────────────────────────────────────────────
  const renderCatCard = (cat, isArchived) => {
    const isOpen      = expanded.has(cat.id);
    const isEditCat   = editCatId === cat.id;
    const isAddAct    = addActCatId === cat.id;
    const activeActs  = cat.activities.filter(a => !a.archived);
    const archActs    = cat.activities.filter(a =>  a.archived);
    const used        = isCatUsed(cat.name);
    const canDelete   = !used;
    const canArchive  = activeCats.length > 1;

    return (
      <div key={cat.id} style={{
        background:'var(--surface)', border:'1px solid var(--border-soft)', borderRadius:12,
        padding: isMobile ? '14px 16px' : '16px 20px',
        marginBottom:10, opacity: isArchived ? 0.72 : 1,
      }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <button onClick={() => toggleExpand(cat.id)} style={{
            width:28, height:28, borderRadius:7, flexShrink:0, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            background:'var(--surface-muted)', border:'1px solid var(--border-soft)',
            color:'var(--text-muted)',
          }}><Chevron open={isOpen}/></button>

          <div style={{ width:12, height:12, borderRadius:'50%', background:cat.color, flexShrink:0 }}/>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:15, fontWeight:600, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cat.name}</span>
              {isArchived && <span className="chip" style={{ padding:'2px 7px', fontSize:11, flexShrink:0 }}>archived</span>}
              {used && !isArchived && <span style={{ fontSize:12, color:'var(--accent-gold)', fontWeight:400, flexShrink:0 }}>· in use</span>}
            </div>
            <div className="t-caption muted" style={{ marginTop:2 }}>
              {activeActs.length} activit{activeActs.length !== 1 ? 'ies' : 'y'}
              {archActs.length > 0 && ` · ${archActs.length} archived`}
            </div>
          </div>

          <div style={{ display:'flex', gap:6, flexShrink:0 }}>
            {!isArchived ? (
              <>
                <button onClick={() => setEditCatId(isEditCat ? null : cat.id)}
                  style={{ padding:'5px 10px', borderRadius:7, fontSize:12, fontWeight:500, border:'1px solid var(--border-soft)', background:'var(--surface-muted)', color:'var(--text-muted)', cursor:'pointer' }}>
                  Edit
                </button>
                {canArchive && (
                  <button onClick={() => archiveCat(cat)}
                    style={{ padding:'5px 10px', borderRadius:7, fontSize:12, fontWeight:500, border:'1px solid var(--border-soft)', background:'var(--surface-muted)', color:'var(--text-muted)', cursor:'pointer' }}>
                    Archive
                  </button>
                )}
                {canArchive && canDelete && (
                  <button onClick={() => deleteCat(cat)}
                    style={{ padding:'5px 10px', borderRadius:7, fontSize:12, fontWeight:500, border:'1px solid color-mix(in oklch, var(--error) 30%, transparent)', background:'color-mix(in oklch, var(--error) 8%, transparent)', color:'var(--error)', cursor:'pointer' }}>
                    Delete
                  </button>
                )}
              </>
            ) : (
              <>
                <button onClick={() => restoreCat(cat)}
                  style={{ padding:'5px 10px', borderRadius:7, fontSize:12, fontWeight:500, border:'1px solid var(--border-soft)', background:'var(--surface-muted)', color:'var(--text-muted)', cursor:'pointer' }}>
                  Restore
                </button>
                {canDelete && (
                  <button onClick={() => deleteCat(cat)}
                    style={{ padding:'5px 10px', borderRadius:7, fontSize:12, fontWeight:500, border:'1px solid color-mix(in oklch, var(--error) 30%, transparent)', background:'color-mix(in oklch, var(--error) 8%, transparent)', color:'var(--error)', cursor:'pointer' }}>
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Inline category edit */}
        {isEditCat && (
          <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid var(--border-soft)' }}>
            <CategoryEditForm
              cat={cat} allNames={allCatNames}
              onSave={patch => updateCat(cat.id, patch)}
              onCancel={() => setEditCatId(null)}
            />
          </div>
        )}

        {/* Activities panel */}
        {isOpen && !isEditCat && (
          <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid var(--border-soft)' }}>
            {activeActs.length === 0 && !isAddAct && (
              <div className="t-caption muted" style={{ marginBottom:8, fontStyle:'italic' }}>
                No activities — add one below.
              </div>
            )}

            {activeActs.map(act => {
              const key = `${cat.id}::${act.id}`;
              const isEditAct = editActKey === key;
              return isEditAct ? (
                <ActivityEditForm
                  key={act.id} act={act}
                  allNames={cat.activities.map(a => a.name)}
                  onSave={patch => updateAct(cat.id, act.id, patch)}
                  onCancel={() => setEditActKey(null)}
                />
              ) : (
                <ActivityViewRow
                  key={act.id} act={act} isMobile={isMobile}
                  onEdit={() => { setEditActKey(key); setAddActCatId(null); }}
                  onArchive={() => archiveAct(cat.id, act)}
                  onDelete={() => deleteAct(cat.id, act)}
                />
              );
            })}

            {archActs.map(act => (
              <ActivityArchivedRow
                key={act.id} act={act}
                onRestore={() => restoreAct(cat.id, act)}
                onDelete={() => deleteAct(cat.id, act)}
              />
            ))}

            {isAddAct ? (
              <AddActivityForm
                existingNames={cat.activities.map(a => a.name)}
                onAdd={actData => addAct(cat.id, actData)}
                onCancel={() => setAddActCatId(null)}
              />
            ) : (
              !isArchived && (
                <button onClick={() => { setAddActCatId(cat.id); setEditActKey(null); }}
                  style={{ marginTop:10, display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:500, color:'var(--accent-gold)', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                  <Icon name="plus" size={14}/> Add activity
                </button>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="fade-in" style={{ padding: isMobile ? '20px 16px 32px' : '40px 48px 80px', maxWidth: 860, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <div className="t-label muted" style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
          <Icon name="settings" size={12}/> Admin settings
        </div>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight:600, letterSpacing:'-0.02em', margin:'0 0 6px' }}>
          Categories &amp; activities
        </h1>
        <p className="t-body muted" style={{ margin:0, maxWidth:520 }}>
          Define what work gets recognised and how many points it's worth.
          Changes apply to Award and Feed immediately.
        </p>
      </div>

      {/* Info banner */}
      <div style={{
        padding:'11px 14px', borderRadius:10, marginBottom:24,
        background:'color-mix(in oklch, var(--accent-gold) 8%, transparent)',
        border:'1px solid color-mix(in oklch, var(--accent-gold) 28%, transparent)',
        fontSize:13, color:'var(--text-muted)', lineHeight:1.55,
        display:'flex', gap:10, alignItems:'flex-start',
      }}>
        <Icon name="sparkles" size={14} style={{ marginTop:1, color:'var(--accent-gold)', flexShrink:0 }}/>
        <span>
          Points are <strong style={{ color:'var(--text)' }}>suggestions</strong> — admins can override before sending.
          Archive hides from forms but keeps history intact. Delete removes permanently.
        </span>
      </div>

      {/* Active categories heading + add button */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div style={{ fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:8 }}>
          Active
          <span className="chip" style={{ padding:'2px 8px', fontSize:11 }}>{activeCats.length}</span>
        </div>
        {!addingCat && (
          <button onClick={() => setAddingCat(true)} className="btn btn-primary"
            style={{ padding:'7px 14px', fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
            <Icon name="plus" size={13}/> Add category
          </button>
        )}
      </div>

      {addingCat && (
        <AddCategoryForm
          allNames={allCatNames}
          onAdd={addCat}
          onCancel={() => setAddingCat(false)}
        />
      )}

      {activeCats.map(cat => renderCatCard(cat, false))}

      {activeCats.length === 0 && !addingCat && (
        <div style={{ padding:24, textAlign:'center', borderRadius:12, border:'1px dashed var(--border)', color:'var(--text-muted)', fontSize:14 }}>
          No active categories. Add one above.
        </div>
      )}

      {/* Archived categories */}
      {archivedCats.length > 0 && (
        <div style={{ marginTop:24 }}>
          <button onClick={() => setShowArchived(v=>!v)}
            style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, fontSize:13, fontWeight:500, color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer', padding:0 }}>
            <Chevron open={showArchived}/>
            Archived categories
            <span className="chip" style={{ padding:'2px 8px', fontSize:11, opacity:0.7 }}>{archivedCats.length}</span>
          </button>
          {showArchived && archivedCats.map(cat => renderCatCard(cat, true))}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop:32, paddingTop:20, borderTop:'1px solid var(--border-soft)', display:'flex', justifyContent:'flex-end' }}>
        <button onClick={() => setShowResetModal(true)} className="btn btn-ghost"
          style={{ padding:'8px 16px', fontSize:13, color:'var(--text-muted)' }}>
          Reset to defaults
        </button>
      </div>

      {showResetModal && (
        <ResetConfirmModal
          onConfirm={() => {
            handleConfigChange(normalizeConfig(window.MERIT_CONFIG_DEFAULTS));
            setShowResetModal(false);
            toast.info('Reset to defaults', 'All categories and activities restored.');
          }}
          onCancel={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
};

Object.assign(window, { SettingsScreen });
