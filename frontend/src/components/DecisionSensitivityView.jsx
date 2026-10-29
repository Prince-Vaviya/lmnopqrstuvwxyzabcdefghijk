import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Clock, TrendingDown, HelpCircle } from 'lucide-react';

export default function DecisionSensitivityView({ dateFrom, dateTo, resolution }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/sensitivity?date_from=${dateFrom}&date_to=${dateTo}&resolution=${resolution}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData.sensitivity || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [dateFrom, dateTo, resolution]);

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Evaluating decision gate sensitivity across forecast publication horizons...
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
            Decision Gate Sensitivity: Value of Timing
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            How forecast accuracy changes if Day-Ahead procurement decisions are locked in at different cutoff times on D-1
          </p>
        </div>

        <div style={{
          background: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#93c5fd'
        }}>
          ⏱️ Standard Gate Closure: 11:00 GMT (EPEX Day-Ahead Auction)
        </div>
      </div>

      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
            <XAxis
              dataKey="cutoffTime"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v} GMT (D-1)`}
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
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="mae" fill="#00e5ff" name="MAE (MW)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rmse" fill="#3b82f6" name="RMSE (MW)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="p90" fill="#f59e0b" name="P90 Safety Buffer (MW)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '14px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
        <strong>Commercial Trading Takeaway:</strong> Forecast accuracy improves when decisions are made closer to delivery as Numerical Weather Prediction (NWP) models ingest the latest satellite and radar soundings. However, exchange liquidity concentrates at the 11:00 GMT auction. Traders can use later intraday runs to refine their residual thermal positions.
      </div>
    </div>
  );
}
