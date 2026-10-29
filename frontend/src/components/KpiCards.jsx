import React from 'react';
import { Target, Activity, AlertTriangle, ShieldCheck, Zap, Gauge } from 'lucide-react';

export default function KpiCards({ metrics }) {
  if (!metrics) return null;

  const isOver = metrics.bias > 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    }}>

      {/* MAE Card */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #00e5ff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Mean Absolute Error
          </span>
          <Target size={18} color="#00e5ff" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
            {metrics.mae?.toLocaleString() ?? 0}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>MW</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <span style={{ fontSize: '12px', color: '#67e8f9' }}>
            Normalized (nMAE): {metrics.nmae}%
          </span>
          <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>• MAPE: {metrics.mape}%</span>
        </div>
      </div>

      {/* RMSE Card */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #3b82f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Root Mean Sq Error
          </span>
          <Activity size={18} color="#3b82f6" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
            {metrics.rmse?.toLocaleString() ?? 0}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>MW</span>
        </div>
        <div style={{ fontSize: '12px', color: '#93c5fd', marginTop: '6px' }}>
          Std Dev (σ): {metrics.stdDev?.toLocaleString()} MW
        </div>
      </div>

      {/* Mean Bias Card (CRITICAL FOR TRADERS) */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: `4px solid ${isOver ? '#f59e0b' : '#38bdf8'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Directional Bias
          </span>
          <AlertTriangle size={18} color={isOver ? '#f59e0b' : '#38bdf8'} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: isOver ? '#fbbf24' : '#38bdf8' }}>
            {metrics.bias > 0 ? `+${metrics.bias?.toLocaleString()}` : metrics.bias?.toLocaleString()}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>MW</span>
        </div>
        <div style={{ marginTop: '6px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '4px',
            background: isOver ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)',
            color: isOver ? '#fde68a' : '#bae6fd'
          }}>
            {isOver ? `SHORT RISK (${metrics.overForecastHoursPct}% of hours)` : `LONG RISK (${metrics.underForecastHoursPct}% of hours)`}
          </span>
        </div>
      </div>

      {/* P90 Safety Hedging Margin Card */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #10b981' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            P90 Hedging Buffer
          </span>
          <ShieldCheck size={18} color="#10b981" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: '#34d399' }}>
            {metrics.p90 > 0 ? `+${metrics.p90?.toLocaleString()}` : metrics.p90?.toLocaleString()}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>MW</span>
        </div>
        <div style={{ fontSize: '12px', color: '#6ee7b7', marginTop: '6px' }}>
          Covers 90% shortfall tail risk
        </div>
      </div>

      {/* Energy Volume Balance Card */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #8b5cf6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Energy Outturn / Imbalance
          </span>
          <Zap size={18} color="#8b5cf6" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>
            {metrics.totalActualGWh?.toLocaleString()}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>GWh Actual</span>
        </div>
        <div style={{ fontSize: '12px', color: '#c4b5fd', marginTop: '6px' }}>
          Net Imbalance: {metrics.netImbalanceGWh > 0 ? `+${metrics.netImbalanceGWh}` : metrics.netImbalanceGWh} GWh
        </div>
      </div>

      {/* Peak Observed Card */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #f43f5e' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Peak Actual Generation
          </span>
          <Gauge size={18} color="#f43f5e" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
            {metrics.peakActualMW?.toLocaleString()}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>MW</span>
        </div>
        <div style={{ fontSize: '12px', color: '#fda4af', marginTop: '6px' }}>
          Periods evaluated: {metrics.count}
        </div>
      </div>

    </div>
  );
}
