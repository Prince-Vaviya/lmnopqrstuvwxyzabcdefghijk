import React from 'react';
import { X, CheckCircle, TrendingUp, ShieldAlert, Award, ArrowRight } from 'lucide-react';

export default function ClientPitchModal({ isOpen, onClose }) {
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
        border: '1px solid rgba(245, 158, 11, 0.4)'
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
            background: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            padding: '3px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em'
          }}>
            COMMERCIAL CLIENT PITCH
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: '#ffffff' }}>
            AeroTrade UK: Optimizing Day-Ahead Power Procurement Under Renewable Uncertainty
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Tailored for the UK Utility Wholesale Trading & Power Purchase Desk
          </p>
        </div>

        {/* Section 1: The Client's Commercial Challenge */}
        <div style={{ marginBottom: '24px', background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '10px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            1. The Trading Desk's Dilemma
          </h3>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
            As a UK energy utility, your desk must lock in power purchase commitments in the wholesale Day-Ahead auction (EPEX SPOT / Nord Pool) before the 11:00 GMT Gate Closure on day D-1. Because renewable wind generation varies heavily with weather front arrivals, buying power requires trusting numerical weather prediction forecasts.
          </p>
          <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(244, 63, 94, 0.1)', borderLeft: '3px solid #f43f5e', fontSize: '13px', color: '#fda4af' }}>
            <strong>The Imbalance Risk:</strong> In January 2026, the national wind forecast systematically <strong>over-forecasted actual generation in 84.4% of hours</strong> with an average positive bias of <strong>+1,840 MW</strong>. A utility relying on unadjusted forecasts would chronically under-procure thermal power day-ahead and face severe cash-out penalties in the Balancing Mechanism!
          </div>
        </div>

        {/* Section 2: How AeroTrade Solves This */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
            2. The AeroTrade Advantage
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            
            <div style={{ background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '14px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00e5ff', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
                <CheckCircle size={16} /> Latest Valid Forecast
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                Strictly aligns the latest forecast published prior to your D-1 11:00 GMT gate closure, eliminating lookahead bias and ensuring true operational reality.
              </p>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
                <ShieldAlert size={16} /> Quantified P90 Hedging Buffer
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                Translates abstract statistical metrics (MAE, RMSE, Percentiles) into an actionable MW thermal reserve buffer to hedge 90% of shortfall events.
              </p>
            </div>

            <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '14px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
                <TrendingUp size={16} /> Diurnal & Evening Peak Focus
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                Uncovers time-of-day error profiles, ensuring your traders take protective positions during expensive 17:00-19:00 evening demand spikes.
              </p>
            </div>

          </div>
        </div>

        {/* Section 3: Commercial ROI */}
        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(0, 229, 255, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '18px 20px', borderRadius: '10px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#34d399', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} /> Direct Impact on Your Trading Bottom Line
          </h3>
          <p style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
            In the UK market, the spread between the wholesale Day-Ahead price (~£75/MWh) and the System Buy Price in Balancing (~£140-£200+/MWh during stress periods) is substantial. Avoiding an average 1,500 MW short imbalance position translates into <strong>hundreds of thousands of pounds saved every week</strong>.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #00e5ff 0%, #3b82f6 100%)',
              border: 'none',
              color: '#0a0e17',
              padding: '9px 20px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            Close Pitch Overview
          </button>
        </div>

      </div>
    </div>
  );
}
