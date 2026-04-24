// Edit Profile — form matching the Merit design system
const EditProfileScreen = ({ data, setScreen, isMobile }) => {
  const toast = useToast();
  const { currentUser } = data;

  const [firstName, setFirstName] = React.useState(() => currentUser.firstName || currentUser.name.split(' ')[0]);
  const [lastName,  setLastName]  = React.useState(() => currentUser.name.split(' ').slice(1).join(' '));
  const [role,      setRole]      = React.useState(currentUser.role);
  const [team,      setTeam]      = React.useState(currentUser.team);
  const [saving,    setSaving]    = React.useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated', 'Your changes have been saved.');
      setScreen('profile');
    }, 700);
  };

  const Field = ({ label, value, onChange, readOnly = false, hint }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <input
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        style={{
          padding: '11px 14px',
          borderRadius: 10,
          border: '1px solid var(--border)',
          background: readOnly ? 'var(--surface-muted)' : 'var(--surface)',
          color: readOnly ? 'var(--text-muted)' : 'var(--text)',
          fontSize: 14,
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'border-color 150ms',
          cursor: readOnly ? 'default' : 'text',
        }}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = 'var(--accent-gold)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
      />
      {hint && <span className="t-caption muted">{hint}</span>}
    </div>
  );

  return (
    <div className="fade-in" style={{ padding: isMobile ? '20px 16px 32px' : '40px 48px 80px', maxWidth: 760, margin: '0 auto' }}>

      {/* Back link */}
      <button
        onClick={() => setScreen('profile')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <Icon name="chevron-left" size={14}/> Back to profile
      </button>

      <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Edit profile</h1>
      <p className="t-body muted" style={{ margin: '0 0 32px' }}>Changes apply to your Merit profile only.</p>

      {/* Avatar preview */}
      <div className="card" style={{ padding: isMobile ? 20 : 28, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <Avatar initials={currentUser.avatarInitials} tone={currentUser.avatarTone || 'gold'} size={72} ring/>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{firstName} {lastName}</div>
          <div className="t-body-sm muted" style={{ marginTop: 2 }}>{role} · {team}</div>
          <div className="t-caption muted" style={{ marginTop: 6 }}>Avatar is set by your Google Workspace profile photo.</div>
        </div>
      </div>

      {/* Form */}
      <div className="card" style={{ padding: isMobile ? 20 : 28, display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
          <Field label="First name" value={firstName} onChange={setFirstName}/>
          <Field label="Last name"  value={lastName}  onChange={setLastName}/>
        </div>
        <Field label="Job title" value={role} onChange={setRole}/>
        <Field label="Team"      value={team} onChange={setTeam}/>
        <Field
          label="Email"
          value={currentUser.email || '—'}
          readOnly
          hint="Email is managed by Google Workspace and cannot be changed here."
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, justifyContent: isMobile ? 'stretch' : 'flex-end', flexDirection: isMobile ? 'column-reverse' : 'row' }}>
        <button
          className="btn btn-ghost"
          style={{ padding: '11px 24px', fontSize: 14 }}
          onClick={() => setScreen('profile')}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          style={{ padding: '11px 24px', fontSize: 14, opacity: saving ? 0.7 : 1 }}
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { EditProfileScreen });
