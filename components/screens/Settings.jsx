// Admin Settings — manage recognition categories and activity types

const PRESET_COLORS = ['#3B82F6','#8B5CF6','#F59E0B','#10B981','#EC4899','#EF4444','#14B8A6','#F97316'];

const genId = (prefix) => prefix + '_' + Math.random().toString(36).slice(2, 8);

const SettingsScreen = ({ config, handleConfigChange, isMobile }) => {
  const { error, info } = useToast();
  const [editingId, setEditingId] = React.useState(null);
  const [showArchived, setShowArchived] = React.useState(false);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const categories = config.categories || [];
  const active = categories.filter(c => !c.archived);
  const archived = categories.filter(c => c.archived);

  const startEdit = (id) => setEditingId(id);
  const stopEdit = () => setEditingId(null);

  const handleArchiveCategory = (id) => {
    if (active.length <= 1) {
      error('Cannot archive', 'At least one active category is required.');
      return;
    }
    const updated = categories.map(c => c.id === id ? { ...c, archived: true } : c);
    handleConfigChange({ ...config, categories: updated });
    info('Category archived', 'It will no longer appear in the Award form.');
  };

  const handleRestoreCategory = (id) => {
    const updated = categories.map(c => c.id === id ? { ...c, archived: false } : c);
    handleConfigChange({ ...config, categories: updated });
  };

  const handleAddCategory = () => {
    const newCat = {
      id: genId('c'),
      name: 'New Category',
      color: PRESET_COLORS[categories.length % PRESET_COLORS.length],
      activities: [],
    };
    const updated = [...categories, newCat];
    handleConfigChange({ ...config, categories: updated });
    setEditingId(newCat.id);
  };

  const handleSaveCategory = (updated) => {
    const nameConflict = categories.some(c => c.id !== updated.id && c.name.trim().toLowerCase() === updated.name.trim().toLowerCase());
    if (nameConflict) {
      error('Duplicate name', 'A category with this name already exists.');
      return false;
    }
    if (!updated.name.trim()) {
      error('Name required', 'Category name cannot be blank.');
      return false;
    }
    const newCategories = categories.map(c => c.id === updated.id ? updated : c);
    handleConfigChange({ ...config, categories: newCategories });
    setEditingId(null);
    return true;
  };

  const handleReset = () => {
    handleConfigChange({ ...window.MERIT_CONFIG_DEFAULTS });
    setShowResetConfirm(false);
    info('Reset complete', 'Categories restored to defaults.');
  };

  const editingCat = editingId ? categories.find(c => c.id === editingId) : null;
  const showTwoCol = !isMobile && editingCat;

  return (
    <div className="fade-in" style={{ padding: isMobile ? '20px 16px' : '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      <ScreenHeader
        eyebrow="Admin"
        title="Settings"
        desc="Manage recognition categories and activity types."
        right={
          <button className="btn btn-primary" onClick={handleAddCategory} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="plus" size={15}/>
            Add category
          </button>
        }
      />

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Category list */}
        <div style={{ flex: showTwoCol ? '0 0 340px' : '1', minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {active.map(cat => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                isEditing={editingId === cat.id}
                onEdit={() => startEdit(cat.id)}
                onArchive={() => handleArchiveCategory(cat.id)}
                canArchive={active.length > 1}
              />
            ))}
          </div>

          {archived.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <button
                onClick={() => setShowArchived(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, marginBottom: 8 }}
              >
                <Icon name={showArchived ? 'chevron-down' : 'chevron-right'} size={14}/>
                Archived ({archived.length})
              </button>
              {showArchived && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {archived.map(cat => (
                    <CategoryCard
                      key={cat.id}
                      cat={cat}
                      isArchived
                      onRestore={() => handleRestoreCategory(cat.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit panel */}
        {editingCat && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <CategoryEditForm
              cat={editingCat}
              onSave={handleSaveCategory}
              onCancel={stopEdit}
              toast={useToast()}
            />
          </div>
        )}
      </div>

      {/* Mobile: edit form below list */}
      {isMobile && editingCat && (
        <div style={{ marginTop: 24 }}>
          <CategoryEditForm
            cat={editingCat}
            onSave={handleSaveCategory}
            onCancel={stopEdit}
            toast={useToast()}
          />
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-ghost"
          onClick={() => setShowResetConfirm(true)}
          style={{ color: 'var(--error)', fontSize: 13 }}
        >
          Reset to defaults
        </button>
      </div>

      {/* Reset confirm dialog */}
      {showResetConfirm && (
        <ResetConfirmDialog onConfirm={handleReset} onCancel={() => setShowResetConfirm(false)}/>
      )}
    </div>
  );
};

const CategoryCard = ({ cat, isEditing, isArchived, onEdit, onArchive, onRestore, canArchive }) => (
  <div
    className="card"
    style={{
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      opacity: isArchived ? 0.6 : 1,
      outline: isEditing ? '2px solid var(--accent-gold)' : 'none',
      outlineOffset: 1,
    }}
  >
    <span style={{ width: 12, height: 12, borderRadius: '50%', background: cat.color, flexShrink: 0 }}/>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
        {(cat.activities || []).filter(a => !a.archived).length} activities
      </div>
    </div>
    {isArchived ? (
      <button className="btn btn-ghost" onClick={onRestore} style={{ fontSize: 12, padding: '4px 10px' }}>Restore</button>
    ) : (
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button className="btn btn-ghost" onClick={onEdit} style={{ fontSize: 12, padding: '4px 10px' }}>Edit</button>
        <button
          className="btn btn-ghost"
          onClick={onArchive}
          disabled={!canArchive}
          title={!canArchive ? 'Cannot archive the last category' : ''}
          style={{ fontSize: 12, padding: '4px 10px', color: 'var(--text-muted)', opacity: canArchive ? 1 : 0.35 }}
        >
          Archive
        </button>
      </div>
    )}
  </div>
);

const CategoryEditForm = ({ cat, onSave, onCancel, toast }) => {
  const [name, setName] = React.useState(cat.name);
  const [color, setColor] = React.useState(cat.color);
  const [activities, setActivities] = React.useState(cat.activities ? JSON.parse(JSON.stringify(cat.activities)) : []);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState(null);

  const handleActivityChange = (id, field, value) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleAddActivity = () => {
    const newAct = { id: genId('a'), name: '', points: 0 };
    setActivities(prev => [...prev, newAct]);
  };

  const handleDeleteActivity = (id) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    setDeleteConfirmId(null);
  };

  const handleArchiveActivity = (id) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, archived: true } : a));
  };

  const handleRestoreActivity = (id) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, archived: false } : a));
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Name required', 'Category name cannot be blank.');
      return;
    }
    // Check duplicate activity names within this category
    const activeActs = activities.filter(a => !a.archived);
    const actNames = activeActs.map(a => a.name.trim().toLowerCase()).filter(Boolean);
    const hasDup = actNames.length !== new Set(actNames).size;
    if (hasDup) {
      toast.error('Duplicate activity', 'Activity names must be unique within a category.');
      return;
    }

    const sanitized = activities.map(a => ({
      ...a,
      name: a.name.trim(),
      points: parseInt(a.points, 10) || 0,
    }));

    const ok = onSave({ ...cat, name: name.trim(), color, activities: sanitized });
    if (!ok) return;
    toast.success('Saved', `"${name.trim()}" updated.`);
  };

  const activeActs = activities.filter(a => !a.archived);
  const archivedActs = activities.filter(a => a.archived);

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Edit category</div>

      {/* Name */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: '100%', padding: '8px 12px', fontSize: 14,
            border: '1px solid var(--border)', borderRadius: 8,
            background: 'var(--bg)', color: 'var(--text)', outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Color */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Color</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 28, height: 28, borderRadius: '50%', background: c, flexShrink: 0,
                border: color === c ? '3px solid var(--text)' : '3px solid transparent',
                boxShadow: color === c ? '0 0 0 1px ' + c : 'none',
              }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Activities */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Activities</label>
          <button className="btn btn-ghost" onClick={handleAddActivity} style={{ fontSize: 12, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="plus" size={12}/> Add
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {activeActs.map(act => (
            <ActivityRow
              key={act.id}
              act={act}
              onChangeName={v => handleActivityChange(act.id, 'name', v)}
              onChangePoints={v => handleActivityChange(act.id, 'points', v)}
              onArchive={() => handleArchiveActivity(act.id)}
              onDeleteRequest={() => setDeleteConfirmId(act.id)}
              isDeleteConfirm={deleteConfirmId === act.id}
              onDeleteConfirm={() => handleDeleteActivity(act.id)}
              onDeleteCancel={() => setDeleteConfirmId(null)}
            />
          ))}
          {activeActs.length === 0 && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '8px 0' }}>No active activities. Add one above.</div>
          )}
        </div>

        {archivedActs.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Archived ({archivedActs.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {archivedActs.map(act => (
                <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.55, fontSize: 13, color: 'var(--text)' }}>
                  <span style={{ flex: 1 }}>{act.name || '(unnamed)'}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{act.points} pts</span>
                  <button className="btn btn-ghost" onClick={() => handleRestoreActivity(act.id)} style={{ fontSize: 11, padding: '2px 8px' }}>Restore</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

const ActivityRow = ({ act, onChangeName, onChangePoints, onArchive, onDeleteRequest, isDeleteConfirm, onDeleteConfirm, onDeleteCancel }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <input
      value={act.name}
      onChange={e => onChangeName(e.target.value)}
      placeholder="Activity name"
      style={{
        flex: 1, padding: '6px 10px', fontSize: 13,
        border: '1px solid var(--border)', borderRadius: 7,
        background: 'var(--bg)', color: 'var(--text)', outline: 'none',
      }}
    />
    <input
      type="number"
      value={act.points}
      onChange={e => onChangePoints(e.target.value)}
      placeholder="pts"
      min="0"
      style={{
        width: 70, padding: '6px 8px', fontSize: 13, textAlign: 'right',
        border: '1px solid var(--border)', borderRadius: 7,
        background: 'var(--bg)', color: 'var(--text)', outline: 'none',
      }}
    />
    <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>pts</span>

    {isDeleteConfirm ? (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Delete?</span>
        <button className="btn btn-ghost" onClick={onDeleteConfirm} style={{ fontSize: 11, padding: '2px 8px', color: 'var(--error)' }}>Yes</button>
        <button className="btn btn-ghost" onClick={onDeleteCancel} style={{ fontSize: 11, padding: '2px 8px' }}>No</button>
      </div>
    ) : (
      <div style={{ display: 'flex', gap: 2 }}>
        <button
          className="btn btn-ghost"
          onClick={onArchive}
          title="Archive activity"
          style={{ padding: '4px 6px', color: 'var(--text-muted)' }}
        >
          <Icon name="archive" size={13}/>
        </button>
        <button
          className="btn btn-ghost"
          onClick={onDeleteRequest}
          title="Delete activity"
          style={{ padding: '4px 6px', color: 'var(--text-muted)' }}
        >
          <Icon name="trash" size={13}/>
        </button>
      </div>
    )}
  </div>
);

const ResetConfirmDialog = ({ onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 300,
    background: 'rgba(11,30,61,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 16,
  }} onClick={onCancel}>
    <div
      className="card"
      style={{ padding: 28, maxWidth: 400, width: '100%' }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Reset to defaults?</div>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
        This will overwrite all current categories and activities with the factory defaults. This cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={onConfirm} style={{ background: 'var(--error)', borderColor: 'var(--error)' }}>Reset</button>
      </div>
    </div>
  </div>
);

Object.assign(window, { SettingsScreen });
