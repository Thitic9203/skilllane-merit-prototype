// Toast notifications — success / error / info
// Stack in bottom-right (desktop) / top (mobile). Auto-dismiss, swipe / click X to dismiss.

const ToastContext = React.createContext({ toast: () => {} });

const useToast = () => React.useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);
  const idRef = React.useRef(0);

  const dismiss = React.useCallback((id) => {
    setToasts(ts => ts.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 240);
  }, []);

  const toast = React.useCallback((opts) => {
    const id = ++idRef.current;
    const t = {
      id,
      kind: opts.kind || 'success',
      title: opts.title || '',
      body: opts.body || '',
      duration: opts.duration ?? 4000,
      action: opts.action || null,
      leaving: false,
    };
    setToasts(ts => [...ts, t].slice(-5)); // cap stack
    if (t.duration > 0) setTimeout(() => dismiss(id), t.duration);
    return id;
  }, [dismiss]);

  // Convenience shortcuts
  const api = React.useMemo(() => ({
    toast,
    success: (title, body, opts={}) => toast({ kind: 'success', title, body, ...opts }),
    error:   (title, body, opts={}) => toast({ kind: 'error',   title, body, ...opts }),
    info:    (title, body, opts={}) => toast({ kind: 'info',    title, body, ...opts }),
    dismiss,
  }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss}/>
    </ToastContext.Provider>
  );
};

const ToastStack = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="toast-stack"
      style={{
        position: 'fixed', zIndex: 200,
        display: 'flex', flexDirection: 'column', gap: 10,
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => <Toast key={t.id} t={t} onDismiss={() => onDismiss(t.id)}/>)}
    </div>
  );
};

const Toast = ({ t, onDismiss }) => {
  const toneMap = {
    success: {
      color: 'var(--success)',
      bg: 'color-mix(in oklch, var(--success) 14%, var(--surface))',
      border: 'color-mix(in oklch, var(--success) 45%, var(--border-soft))',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>,
    },
    error: {
      color: 'var(--error)',
      bg: 'color-mix(in oklch, var(--error) 14%, var(--surface))',
      border: 'color-mix(in oklch, var(--error) 45%, var(--border-soft))',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><circle cx="12" cy="16" r="0.8" fill="currentColor"/></svg>,
    },
    info: {
      color: 'var(--accent-gold)',
      bg: 'color-mix(in oklch, var(--accent-gold) 14%, var(--surface))',
      border: 'color-mix(in oklch, var(--accent-gold) 45%, var(--border-soft))',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v0.01M12 11v5"/></svg>,
    },
  };
  const tone = toneMap[t.kind] || toneMap.success;

  return (
    <div
      role="status"
      className={`toast ${t.leaving ? 'toast-leaving' : ''}`}
      style={{
        pointerEvents: 'auto',
        display: 'flex', gap: 12, alignItems: 'flex-start',
        padding: '14px 16px',
        minWidth: 280, maxWidth: 420,
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        borderRadius: 14,
        boxShadow: '0 12px 30px rgba(11,30,61,0.18), 0 2px 6px rgba(11,30,61,0.08)',
        color: 'var(--text)',
      }}
    >
      <div style={{
        width: 28, height: 28, flexShrink: 0,
        borderRadius: '50%',
        background: tone.color, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {tone.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.005em', color: 'var(--text)' }}>{t.title}</div>
        {t.body && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.5 }}>{t.body}</div>}
        {t.action && (
          <button
            onClick={() => { t.action.onClick(); onDismiss(); }}
            style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: tone.color, padding: '4px 0' }}
          >
            {t.action.label} →
          </button>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        style={{
          width: 24, height: 24, flexShrink: 0,
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)',
          marginTop: 1,
        }}
      >
        <Icon name="x" size={14}/>
      </button>
    </div>
  );
};

Object.assign(window, { ToastProvider, useToast, ToastContext });
