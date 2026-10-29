import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export default function DiurnalProfileView({ profile }) {
  if (!profile || profile.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
            Diurnal Profile: 24-Hour Forecast Error Pattern
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Hourly distribution of MAE and Directional Bias across all evaluated days in January 2026
          </p>
        </div>

        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#fbbf24'
        }}>
          💡 Note Evening Peak (17:00-20:00): Crucial window for thermal ramp hedging
        </div>
      </div>

      <div style={{ height: '320px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={profile} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
            <XAxis
              dataKey="hourLabel"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
              unit=" MW"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px'
              }}
              formatter={(val, name) => [`${val.toLocaleString()} MW`, name]}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
            <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.3)" />
            <Bar dataKey="mae" fill="#00e5ff" name="Mean Absolute Error (MAE)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="bias" fill="#f59e0b" name="Mean Directional Bias" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
