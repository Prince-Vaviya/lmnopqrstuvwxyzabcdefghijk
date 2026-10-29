import React from 'react';
import { Calendar, Clock, RefreshCw, SlidersHorizontal, Layers } from 'lucide-react';

const PRESETS = [
  { label: 'Full Month (Jan 2026)', from: '2026-01-01', to: '2026-01-31' },
  { label: 'Week 1 (Storm Event)', from: '2026-01-01', to: '2026-01-07' },
  { label: 'Week 2 (Jan 08-14)', from: '2026-01-08', to: '2026-01-14' },
  { label: 'Week 3 (Jan 15-21)', from: '2026-01-15', to: '2026-01-21' },
  { label: 'Week 4 (Jan 22-31)', from: '2026-01-22', to: '2026-01-31' },
];

export default function ControlBar({
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  cutoffTime,
  setCutoffTime,
  resolution,
  setResolution,
  onRefresh,
  loading
}) {
  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Preset Range Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Presets:
          </span>
          {PRESETS.map((p) => {
            const isActive = dateFrom === p.from && dateTo === p.to;
            return (
              <button
                key={p.label}
                id={`preset-${p.from}`}
                onClick={() => {
                  setDateFrom(p.from);
                  setDateTo(p.to);
                }}
                style={{
                  background: isActive ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 500
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Input Parameters Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            
            {/* Date Range Picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <Calendar size={15} color="#00e5ff" />
                <span>Delivery Window:</span>
              </div>
              <input
                id="input-date-from"
                type="date"
                min="2026-01-01"
                max="2026-01-31"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>to</span>
              <input
                id="input-date-to"
                type="date"
                min="2026-01-01"
                max="2026-01-31"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            {/* D-1 Decision Gate Closure Cutoff */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <Clock size={15} color="#3b82f6" />
                <span>D-1 Gate Closure:</span>
              </div>
              <select
                id="select-cutoff-time"
                value={cutoffTime}
                onChange={(e) => setCutoffTime(e.target.value)}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="09:00">09:00 GMT (Early Morning)</option>
                <option value="11:00">11:00 GMT (EPEX Day-Ahead Gate)</option>
                <option value="12:00">12:00 GMT (Noon Auction)</option>
                <option value="14:00">14:00 GMT (Post-Auction)</option>
                <option value="18:00">18:00 GMT (Late Afternoon)</option>
              </select>
            </div>

            {/* Resolution Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <Layers size={15} color="#10b981" />
                <span>Resolution:</span>
              </div>
              <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <button
                  id="btn-resolution-hourly"
                  onClick={() => setResolution('hourly')}
                  style={{
                    background: resolution === 'hourly' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    color: resolution === 'hourly' ? '#34d399' : 'var(--text-muted)',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: resolution === 'hourly' ? 600 : 400
                  }}
                >
                  Hourly (24 SP)
                </button>
                <button
                  id="btn-resolution-halfhourly"
                  onClick={() => setResolution('half_hourly')}
                  style={{
                    background: resolution === 'half_hourly' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    color: resolution === 'half_hourly' ? '#34d399' : 'var(--text-muted)',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: resolution === 'half_hourly' ? 600 : 400
                  }}
                >
                  Half-Hourly (48 SP)
                </button>
              </div>
            </div>

          </div>

          {/* Action / Refresh */}
          <button
            id="btn-refresh"
            onClick={onRefresh}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              color: '#00e5ff',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>{loading ? 'Recalculating...' : 'Update Models'}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
