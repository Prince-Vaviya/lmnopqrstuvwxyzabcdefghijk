import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlBar from './components/ControlBar';
import KpiCards from './components/KpiCards';
import TimeSeriesView from './components/TimeSeriesView';
import DiurnalProfileView from './components/DiurnalProfileView';
import ErrorDistributionView from './components/ErrorDistributionView';
import DecisionSensitivityView from './components/DecisionSensitivityView';
import ProcurementSimulator from './components/ProcurementSimulator';
import DataTable from './components/DataTable';
import ClientPitchModal from './components/ClientPitchModal';
import TechSpecModal from './components/TechSpecModal';
import { LineChart, Clock, BarChart3, Sliders, Calculator, Table } from 'lucide-react';

export default function App() {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-01-31');
  const [cutoffTime, setCutoffTime] = useState('11:00');
  const [resolution, setResolution] = useState('hourly');
  const [activeTab, setActiveTab] = useState('timeseries');

  const [metrics, setMetrics] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [diurnal, setDiurnal] = useState([]);
  const [distribution, setDistribution] = useState(null);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPitchModal, setShowPitchModal] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const query = `date_from=${dateFrom}&date_to=${dateTo}&cutoff_time=${cutoffTime}&resolution=${resolution}`;
    try {
      const [resOverview, resTimeseries, resDiurnal, resDist, resDaily] = await Promise.all([
        fetch(`/api/overview?${query}`).then(r => r.json()),
        fetch(`/api/timeseries?${query}`).then(r => r.json()),
        fetch(`/api/diurnal?${query}`).then(r => r.json()),
        fetch(`/api/distribution?${query}`).then(r => r.json()),
        fetch(`/api/daily?${query}`).then(r => r.json()),
      ]);

      setMetrics(resOverview.metrics);
      setTimeseries(resTimeseries.data || []);
      setDiurnal(resDiurnal.profile || []);
      setDistribution(resDist);
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

  const tabs = [
    { id: 'timeseries', label: 'Day-Ahead Curve & Delta', icon: LineChart },
    { id: 'procurement', label: 'Thermal Hedging Calculator', icon: Calculator },
    { id: 'diurnal', label: '24-Hour Diurnal Pattern', icon: Clock },
    { id: 'distribution', label: 'Error Distribution & VaR', icon: BarChart3 },
    { id: 'sensitivity', label: 'Decision Gate Sensitivity', icon: Sliders },
    { id: 'table', label: 'Daily Data Ledger', icon: Table },
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Top Header */}
      <Header
        onOpenPitch={() => setShowPitchModal(true)}
        onOpenTech={() => setShowTechModal(true)}
      />

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

      {/* High-Impact Executive KPIs */}
      <KpiCards metrics={metrics} />

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                borderRadius: '6px 6px 0 0',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Area */}
      {activeTab === 'timeseries' && (
        <TimeSeriesView data={timeseries} resolution={resolution} />
      )}

      {activeTab === 'procurement' && (
        <ProcurementSimulator metrics={metrics} />
      )}

      {activeTab === 'diurnal' && (
        <DiurnalProfileView profile={diurnal} />
      )}

      {activeTab === 'distribution' && (
        <ErrorDistributionView distribution={distribution} metrics={metrics} />
      )}

      {activeTab === 'sensitivity' && (
        <DecisionSensitivityView
          dateFrom={dateFrom}
          dateTo={dateTo}
          resolution={resolution}
        />
      )}

      {activeTab === 'table' && (
        <DataTable dailyData={daily} />
      )}

      {/* Footer Info */}
      <footer style={{
        marginTop: '30px',
        padding: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-dim)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div>
          AeroTrade UK Decision Desk • Data Source: Elexon BMRS API (Datasets <code>FUELHH: WIND</code> & <code>WINDFOR</code>)
        </div>
        <div style={{ marginTop: '4px' }}>
          Configured for UK Wholesale Day-Ahead Power Procurement • January 2026 Decision Horizons
        </div>
      </footer>

      {/* Presentation Modals */}
      <ClientPitchModal
        isOpen={showPitchModal}
        onClose={() => setShowPitchModal(false)}
      />

      <TechSpecModal
        isOpen={showTechModal}
        onClose={() => setShowTechModal(false)}
      />

    </div>
  );
}
