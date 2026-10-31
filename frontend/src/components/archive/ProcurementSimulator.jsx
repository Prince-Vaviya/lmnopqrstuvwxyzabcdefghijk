import React, { useState } from 'react';
import { Calculator, ShieldCheck, AlertOctagon, Flame, ArrowRight, DollarSign } from 'lucide-react';

export default function ProcurementSimulator({ metrics }) {
  const [consumerDemand, setConsumerDemand] = useState(25000); // 25,000 MW
  const [selectedWindPct, setSelectedWindPct] = useState(100); // 100% of national wind share or custom portfolio
  const [imbalancePriceSpread, setImbalancePriceSpread] = useState(65); // £65/MWh penalty spread between balancing and day-ahead

  if (!metrics) return null;

  const avgWindForecast = (metrics.totalForecastGWh * 1000) / (metrics.count || 744);
  const effectiveWind = (avgWindForecast * selectedWindPct) / 100;
  
  // Unadjusted procurement: simply Demand - Forecast
  const unhedgedThermal = Math.max(0, consumerDemand - effectiveWind);

  // Recommended procurement accounting for P90 forecast risk or bias
  const recommendedBuffer = Math.max(0, metrics.p90);
  const hedgedThermal = Math.max(0, consumerDemand - (effectiveWind - recommendedBuffer));
  const additionalProcurementMW = hedgedThermal - unhedgedThermal;

  // Estimated balancing penalty avoided
  const estimatedSavingsPerHour = (additionalProcurementMW * imbalancePriceSpread);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          padding: '8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Calculator size={22} color="#10b981" />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
            Day-Ahead Thermal Hedging & Procurement Decision Calculator
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Calculate residual power to procure from thermal/wholesale markets accounting for quantified wind forecast uncertainty
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '16px' }}>
        
        {/* Controls Column */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Utility Position Parameters
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Consumer Demand:</span>
              <span className="font-mono font-bold" style={{ color: '#ffffff' }}>{consumerDemand.toLocaleString()} MW</span>
            </div>
            <input
              type="range"
              min="10000"
              max="45000"
              step="500"
              value={consumerDemand}
              onChange={(e) => setConsumerDemand(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#00e5ff', cursor: 'pointer' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>National Wind Portfolio Allocation:</span>
              <span className="font-mono font-bold" style={{ color: '#ffffff' }}>{selectedWindPct}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={selectedWindPct}
              onChange={(e) => setSelectedWindPct(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Balancing Spread Penalty (SBP - DA):</span>
              <span className="font-mono font-bold" style={{ color: '#ffffff' }}>£{imbalancePriceSpread}/MWh</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="5"
              value={imbalancePriceSpread}
              onChange={(e) => setImbalancePriceSpread(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Results & Recommendation Column */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#34d399', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Day-Ahead Procurement Recommendation
            </h3>

            {/* Unhedged vs Hedged Comparison */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Naive Thermal Need (Demand - Forecast):</span>
                <span className="font-mono" style={{ fontSize: '15px', color: '#94a3b8', textDecoration: 'line-through' }}>
                  {Math.round(unhedgedThermal).toLocaleString()} MW
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#34d399', display: 'block' }}>
                    Recommended Procurement (with P90 Buffer):
                  </span>
                  <span style={{ fontSize: '11px', color: '#a7f3d0' }}>
                    Hedges against observed +{metrics.bias} MW systemic over-forecasting
                  </span>
                </div>
                <span className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#34d399' }}>
                  {Math.round(hedgedThermal).toLocaleString()} MW
                </span>
              </div>

            </div>

            {/* Risk Buffer MW */}
            <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '6px', fontSize: '12px', color: '#fde68a' }}>
              🛡️ <strong>Safety Margin Added:</strong> +{Math.round(additionalProcurementMW).toLocaleString()} MW thermal reserve.
            </div>
          </div>

          {/* Financial Value */}
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Estimated Imbalance Penalty Avoided:</span>
            <span className="font-mono font-bold" style={{ fontSize: '16px', color: '#38bdf8' }}>
              ~£{Math.round(estimatedSavingsPerHour).toLocaleString()} / hour
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
