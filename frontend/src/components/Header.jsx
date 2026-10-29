import React from 'react';
import { Wind, Activity, Zap, BookOpen, Cpu, ShieldCheck } from 'lucide-react';

export default function Header({ onOpenPitch, onOpenTech }) {
  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #00e5ff 0%, #3b82f6 100%)',
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)'
          }}>
            <Wind size={26} color="#0a0e17" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AeroTrade UK
              </h1>
              <span style={{
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                letterSpacing: '0.04em'
              }}>
                DAY-AHEAD DESK
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              UK National Renewable Generation & Day-Ahead Wholesale Procurement Intelligence
            </p>
          </div>
        </div>

        {/* Live Elexon Status & Quick Pitch Modals */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#34d399',
            fontWeight: 500
          }}>
            <span className="pulse-dot"></span>
            <span>Elexon BMRS Live (Jan 2026)</span>
          </div>

          <button
            id="btn-client-pitch"
            onClick={onOpenPitch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.08) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fbbf24',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <BookOpen size={15} />
            <span>Client Pitch</span>
          </button>

          <button
            id="btn-tech-spec"
            onClick={onOpenTech}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.08) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: '#c084fc',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <Cpu size={15} />
            <span>Tech Lead Review</span>
          </button>

        </div>

      </div>
    </header>
  );
}
