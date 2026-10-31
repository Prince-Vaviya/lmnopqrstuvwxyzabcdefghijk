import React from 'react';
import { Calendar, RefreshCw, Layers } from 'lucide-react';

export default function ControlBar({
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  resolution,
  setResolution,
  onRefresh,
  loading
}) {
  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Date Range Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="#00e5ff" />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Date Range:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="date"
              min="2026-01-01"
              max="2026-01-31"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>to</span>
            <input
              type="date"
              min="2026-01-01"
              max="2026-01-31"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          {/* Granularity / Resolution */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
            <Layers size={15} color="#3b82f6" />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Resolution:</span>
            <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.25)', borderRadius: '6px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setResolution('hourly')}
                style={{
                  background: resolution === 'hourly' ? 'var(--accent-blue)' : 'transparent',
                  color: resolution === 'hourly' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Hourly
              </button>
              <button
                onClick={() => setResolution('half_hourly')}
                style={{
                  background: resolution === 'half_hourly' ? 'var(--accent-blue)' : 'transparent',
                  color: resolution === 'half_hourly' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Half-Hourly
              </button>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              color: 'var(--accent-cyan)',
              padding: '7px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
