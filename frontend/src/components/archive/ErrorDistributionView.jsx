import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell
} from 'recharts';
import { Percent, ShieldAlert } from 'lucide-react';

export default function ErrorDistributionView({ distribution, metrics }) {
  if (!distribution || !distribution.bins || distribution.bins.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
            Forecast Error Distribution & Value-at-Risk (VaR)
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Histogram frequency of forecast errors with empirical percentile confidence markers
          </p>
        </div>

        {/* Quantile Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 10px', borderRadius: '6px', color: '#7dd3fc' }}>
            P10: <span className="font-mono font-bold">{metrics?.p10} MW</span>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '6px', color: '#6ee7b7' }}>
            Median (P50): <span className="font-mono font-bold">{metrics?.p50} MW</span>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 10px', borderRadius: '6px', color: '#fde68a' }}>
            P90 Buffer: <span className="font-mono font-bold">{metrics?.p90} MW</span>
          </div>
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '4px 10px', borderRadius: '6px', color: '#fca5a5' }}>
            P95 Tail: <span className="font-mono font-bold">{metrics?.p95} MW</span>
          </div>
        </div>
      </div>

      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution.bins} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
            <XAxis
              dataKey="binMid"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v > 0 ? '+' : ''}${(v / 1000).toFixed(1)}k`}
              unit=" MW"
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              unit=" periods"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px'
              }}
              formatter={(val, name, item) => [
                `${val} periods (${item.payload.percentage}%)`,
                'Frequency'
              ]}
              labelFormatter={(val) => `Error Bin: ~${val} MW`}
            />
            <ReferenceLine x={0} stroke="rgba(255, 255, 255, 0.4)" strokeWidth={1.5} label={{ value: 'Zero Error', fill: '#94a3b8', fontSize: 11 }} />
            <Bar dataKey="count" name="Periods">
              {distribution.bins.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.binMid >= 0 ? '#f59e0b' : '#38bdf8'}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
        <div>
          👈 <strong>Under-Forecast Region</strong> (Wind exceeds model; utility is Long)
        </div>
        <div>
          👉 <strong>Over-Forecast Region</strong> (Wind falls short; utility is Short - requires thermal backup)
        </div>
      </div>
    </div>
  );
}
