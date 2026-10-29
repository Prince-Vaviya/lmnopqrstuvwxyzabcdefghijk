import React, { useState } from 'react';
import { Download, Search, ArrowUpDown, ChevronDown } from 'lucide-react';

export default function DataTable({ dailyData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortAsc, setSortAsc] = useState(true);

  if (!dailyData || dailyData.length === 0) return null;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filtered = dailyData.filter((d) =>
    d.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const exportCSV = () => {
    const headers = ['Date', 'Actual_MWh', 'Forecast_MWh', 'MAE_MW', 'RMSE_MW', 'MeanBias_MW', 'Direction', 'Peak_MW'];
    const rows = sorted.map((d) => [
      d.date,
      d.totalActualMWh,
      d.avgForecast * d.periods,
      d.mae,
      d.rmse,
      d.bias,
      d.direction,
      d.peakActual
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `elexon_wind_accuracy_jan2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px' }}>
      
      {/* Table Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
            Daily Breakdown & Verification Ledger
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Daily metrics aggregated across all half-hourly settlement periods for January 2026
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.8)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '12px', outline: 'none', width: '110px' }}
            />
          </div>

          {/* Export CSV Button */}
          <button
            id="btn-export-csv"
            onClick={exportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: '#f1f5f9',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th onClick={() => handleSort('date')} style={{ padding: '10px 12px', cursor: 'pointer' }}>Date</th>
              <th onClick={() => handleSort('totalActualMWh')} style={{ padding: '10px 12px', cursor: 'pointer' }}>Actual Energy (MWh)</th>
              <th onClick={() => handleSort('avgActual')} style={{ padding: '10px 12px', cursor: 'pointer' }}>Avg Actual (MW)</th>
              <th onClick={() => handleSort('avgForecast')} style={{ padding: '10px 12px', cursor: 'pointer' }}>Avg Forecast (MW)</th>
              <th onClick={() => handleSort('mae')} style={{ padding: '10px 12px', cursor: 'pointer' }}>MAE (MW)</th>
              <th onClick={() => handleSort('rmse')} style={{ padding: '10px 12px', cursor: 'pointer' }}>RMSE (MW)</th>
              <th onClick={() => handleSort('bias')} style={{ padding: '10px 12px', cursor: 'pointer' }}>Mean Bias (MW)</th>
              <th style={{ padding: '10px 12px' }}>Risk Direction</th>
              <th onClick={() => handleSort('peakActual')} style={{ padding: '10px 12px', cursor: 'pointer' }}>Peak Outturn (MW)</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const isOver = row.bias > 0;
              return (
                <tr key={row.date} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.15s ease' }}>
                  <td className="font-mono" style={{ padding: '10px 12px', fontWeight: 600, color: '#f8fafc' }}>
                    {row.date}
                  </td>
                  <td className="font-mono" style={{ padding: '10px 12px', color: '#cbd5e1' }}>
                    {Math.round(row.totalActualMWh).toLocaleString()}
                  </td>
                  <td className="font-mono" style={{ padding: '10px 12px', color: '#10b981' }}>
                    {Math.round(row.avgActual).toLocaleString()}
                  </td>
                  <td className="font-mono" style={{ padding: '10px 12px', color: '#00e5ff' }}>
                    {Math.round(row.avgForecast).toLocaleString()}
                  </td>
                  <td className="font-mono" style={{ padding: '10px 12px', fontWeight: 600, color: '#ffffff' }}>
                    {row.mae.toLocaleString()}
                  </td>
                  <td className="font-mono" style={{ padding: '10px 12px', color: '#93c5fd' }}>
                    {row.rmse.toLocaleString()}
                  </td>
                  <td className="font-mono" style={{ padding: '10px 12px', fontWeight: 700, color: isOver ? '#fbbf24' : '#38bdf8' }}>
                    {row.bias > 0 ? `+${row.bias.toLocaleString()}` : row.bias.toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: isOver ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                      color: isOver ? '#fde68a' : '#bae6fd'
                    }}>
                      {isOver ? 'Over (Short)' : 'Under (Long)'}
                    </span>
                  </td>
                  <td className="font-mono" style={{ padding: '10px 12px', color: '#f43f5e' }}>
                    {Math.round(row.peakActual).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
