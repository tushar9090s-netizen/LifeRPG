import React from 'react';

export const QuestToast = ({ toast }) => {
  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '72px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 250,
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--accent)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 12px var(--accent-glow)',
        borderRadius: '24px',
        padding: '10px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        animation: 'toastSlideDown 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        pointerEvents: 'none'
      }}
    >
      <span style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>✨</span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text)' }}>
          {toast.message}
        </span>
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', marginTop: '2px' }}>
          <span style={{ color: 'var(--accent)', fontWeight: '600' }}>+{toast.xp} XP</span>
          <span style={{ color: 'var(--gold)', fontWeight: '600' }}>+{toast.gold} Gold</span>
        </div>
      </div>
    </div>
  );
};

