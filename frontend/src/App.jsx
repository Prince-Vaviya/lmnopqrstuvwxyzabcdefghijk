import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlBar from './components/ControlBar';
import KpiCards from './components/KpiCards';
import TimeSeriesView from './components/TimeSeriesView';
import DataTable from './components/DataTable';
import { LineChart, Table } from 'lucide-react';

export default function App() {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-01-31');
  const [cutoffTime, setCutoffTime] = useState('11:00');
  const [resolution, setResolution] = useState('hourly');
  const [activeTab, setActiveTab] = useState('chart');

  const [metrics, setMetrics] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const query = `date_from=${dateFrom}&date_to=${dateTo}&cutoff_time=${cutoffTime}&resolution=${resolution}`;
    try {
      const [resOverview, resTimeseries, resDaily] = await Promise.all([
        fetch(`/api/overview?${query}`).then(r => r.json()),
        fetch(`/api/timeseries?${query}`).then(r => r.json()),
        fetch(`/api/daily?${query}`).then(r => r.json()),
      ]);

      setMetrics(resOverview.metrics);
      setTimeseries(resTimeseries.data || []);
      setDaily(resDaily.daily || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateFrom, dateTo, cutoffTime, resolution]);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Top Header */}
      <Header />

      {/* Control Filter Bar */}
      <ControlBar
        dateFrom={dateFrom}
        dateTo={dateTo}
        setDateFrom={setDateFrom}
        setDateTo={setDateTo}
        cutoffTime={cutoffTime}
        setCutoffTime={setCutoffTime}
        resolution={resolution}
        setResolution={setResolution}
        onRefresh={fetchData}
        loading={loading}
      />

      {/* Summary KPI Cards */}
      <KpiCards metrics={metrics} />

      {/* View Toggle Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '20px',
      }}>
        <button
          onClick={() => setActiveTab('chart')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'chart' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            color: activeTab === 'chart' ? 'var(--accent-cyan)' : 'var(--text-muted)',
            fontWeight: activeTab === 'chart' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <LineChart size={17} />
          <span>Forecast vs Actual Chart</span>
        </button>

        <button
          onClick={() => setActiveTab('table')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'table' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            color: activeTab === 'table' ? 'var(--accent-cyan)' : 'var(--text-muted)',
            fontWeight: activeTab === 'table' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Table size={17} />
          <span>Daily Data Ledger</span>
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="pulse-dot" style={{ display: 'inline-block', marginBottom: '12px' }}></div>
          <div>Loading UK wind power dataset...</div>
        </div>
      ) : (
        <div>
          {activeTab === 'chart' && (
            <TimeSeriesView data={timeseries} resolution={resolution} />
          )}

          {activeTab === 'table' && (
            <DataTable dailyData={daily} />
          )}
        </div>
      )}

    </div>
  );
}
