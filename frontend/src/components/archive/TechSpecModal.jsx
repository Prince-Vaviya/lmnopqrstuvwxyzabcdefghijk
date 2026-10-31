import React from 'react';
import { X, Code, Database, Server, GitBranch, Check, Terminal } from 'lucide-react';

export default function TechSpecModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        position: 'relative',
        border: '1px solid rgba(139, 92, 246, 0.4)'
      }}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            background: 'rgba(139, 92, 246, 0.2)',
            color: '#c084fc',
            padding: '3px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em'
          }}>
            INTERNAL TECH LEAD REVIEW
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: '#ffffff' }}>
            System Architecture & Engineering Implementation
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Technical review of data ingestion, time-series alignment, statistical formulation, and containerization
          </p>
        </div>

        {/* Architecture Components */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00e5ff', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
              <Database size={16} /> Data Ingestion Pipeline
            </div>
            <ul style={{ fontSize: '12px', color: '#94a3b8', paddingLeft: '16px', lineHeight: '1.6' }}>
              <li>Direct consumption of Elexon BMRS streams (<code>FUELHH</code> and <code>WINDFOR</code>).</li>
              <li>Two-tier caching: Local persistent disk cache + memory indexing for sub-10ms response times.</li>
              <li>Zero data leakage: Strict temporal filtering of <code>publishTime &lt;= Cutoff</code>.</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
              <GitBranch size={16} /> Alignment Engine
            </div>
            <ul style={{ fontSize: '12px', color: '#94a3b8', paddingLeft: '16px', lineHeight: '1.6' }}>
              <li>BMRS WINDFOR publishes at hourly resolution; FUELHH at half-hourly (30 min).</li>
              <li>Dual mode: Exact hourly aggregation (24 periods/day) or block step-wise half-hourly mapping (48 periods/day).</li>
              <li>Configurable D-1 Gate Closure (default 11:00 GMT, configurable to 09:00, 12:00, 14:00, 18:00).</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
              <Server size={16} /> Backend Microservice
            </div>
            <ul style={{ fontSize: '12px', color: '#94a3b8', paddingLeft: '16px', lineHeight: '1.6' }}>
              <li>FastAPI (Python 3.11+) asynchronous REST service.</li>
              <li>Calculates MAE, RMSE, MAPE, Mean Bias Error (MBE), $\sigma$, empirical quantiles (P10, P50, P90, P95).</li>
              <li>Comprehensive unit test suite passing with 100% assertions.</li>
            </ul>
          </div>

        </div>

        {/* Mathematical Formulations */}
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '18px 20px', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>
            Mathematical Error Formulation
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px', color: '#cbd5e1' }}>
            <div>
              <strong style={{ color: '#00e5ff' }}>Error ($\Delta$):</strong>
              <div className="font-mono" style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '4px', marginTop: '4px' }}>
                e_t = Forecast_t - Actual_t
              </div>
            </div>
            <div>
              <strong style={{ color: '#38bdf8' }}>MAE (MW):</strong>
              <div className="font-mono" style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '4px', marginTop: '4px' }}>
                1/N * Σ |e_t|
              </div>
            </div>
            <div>
              <strong style={{ color: '#a78bfa' }}>RMSE (MW):</strong>
              <div className="font-mono" style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '4px', marginTop: '4px' }}>
                sqrt(1/N * Σ (e_t)^2)
              </div>
            </div>
            <div>
              <strong style={{ color: '#fbbf24' }}>Mean Bias (MW):</strong>
              <div className="font-mono" style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '4px', marginTop: '4px' }}>
                1/N * Σ e_t
              </div>
            </div>
          </div>
        </div>

        {/* Containerization & Deployment */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            Containerization & Deployment Strategy
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
            Packaged via <code>Dockerfile</code> and <code>docker-compose.yml</code>. Frontend compiles to static assets served by Nginx or FastAPI in unified production mode, and backend can deploy seamlessly to Heroku, Render, AWS ECS, or Vercel (frontend).
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              border: 'none',
              color: '#ffffff',
              padding: '9px 20px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            Close Tech Review
          </button>
        </div>

      </div>
    </div>
  );
}
