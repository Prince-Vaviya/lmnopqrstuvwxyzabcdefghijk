import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Brush,
  ReferenceLine
} from 'recharts';

export default function TimeSeriesView({ data, resolution }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No time-series data available for the selected parameters.
      </div>
    );
  }

  // Format timestamp for display
  const chartData = data.map((d) => ({
    ...d,
    displayTime: d.timestamp.replace('T', ' ').substring(5, 16),
    overForecastVal: d.error > 0 ? d.error : 0,
    underForecastVal: d.error < 0 ? d.error : 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const isOver = item.error > 0;
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.96)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
          color: '#f8fafc',
          minWidth: '240px'
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>
            Target: {item.timestamp.replace('Z', ' UTC')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '4px' }}>
            <span style={{ color: '#10b981', fontWeight: 600 }}>Actual Wind:</span>
            <span className="font-mono">{item.actual?.toLocaleString()} MW</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '4px' }}>
            <span style={{ color: '#00e5ff', fontWeight: 600 }}>Latest Forecast:</span>
            <span className="font-mono">{item.forecast?.toLocaleString()} MW</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            paddingTop: '6px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            marginTop: '6px'
          }}>
            <span style={{ color: isOver ? '#fbbf24' : '#38bdf8', fontWeight: 700 }}>
              {isOver ? 'Over-Forecast (Short):' : 'Under-Forecast (Long):'}
            </span>
            <span className="font-mono" style={{ color: isOver ? '#fbbf24' : '#38bdf8', fontWeight: 700 }}>
              {item.error > 0 ? `+${item.error?.toLocaleString()}` : item.error?.toLocaleString()} MW ({item.pctError}%)
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
            Forecast Published: {item.publishTime.replace('T', ' ').substring(5, 16)} UTC ({item.leadHours}h prior)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
      
      {/* Chart Title & Legend Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
            National Wind Generation: Actual vs Day-Ahead Forecast Trajectory
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Comparing outturn (`FUELHH: WIND`) against latest forecast (`WINDFOR`) available at D-1 decision gate
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px', display: 'inline-block' }}></span>
            <span style={{ color: 'var(--text-main)' }}>Actual Outturn (MW)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: '#00e5ff', display: 'inline-block' }}></span>
            <span style={{ color: 'var(--text-main)' }}>Day-Ahead Forecast (MW)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '2px', display: 'inline-block' }}></span>
            <span style={{ color: '#fbbf24' }}>Over-Forecast (MW)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#38bdf8', borderRadius: '2px', display: 'inline-block' }}></span>
            <span style={{ color: '#38bdf8' }}>Under-Forecast (MW)</span>
          </div>
        </div>
      </div>

      {/* Main Generation Chart */}
      <div style={{ height: '380px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
            <XAxis
              dataKey="displayTime"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              domain={[0, 'auto']}
              unit=" MW"
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual Outturn"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#actualGradient)"
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Day-Ahead Forecast"
              stroke="#00e5ff"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Delta Error Sub-Chart */}
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Forecast Error Delta (Forecast - Actual MW)
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            Positive = Over-Forecast (Short Risk) | Negative = Under-Forecast (Long Risk)
          </span>
        </div>
        <div style={{ height: '140px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="displayTime" hide />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                unit=" MW"
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.3)" strokeWidth={1} />
              <Bar dataKey="overForecastVal" fill="#f59e0b" name="Over-Forecast" />
              <Bar dataKey="underForecastVal" fill="#38bdf8" name="Under-Forecast" />
              <Brush
                dataKey="displayTime"
                height={26}
                stroke="#38bdf8"
                fill="#0f172a"
                travellerWidth={10}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
