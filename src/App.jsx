import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCampaigns } from './hooks/useCampaigns.js';
import { useAggregateInsights } from './hooks/useAggregateInsights.js';
import { useCampaignDetails } from './hooks/useCampaignDetails.js';
import { useCampaignInsights } from './hooks/useCampaignInsights.js';
import { AggregateKpis } from './components/AggregateKpis.jsx';
import { CampaignFilters } from './components/CampaignFilters.jsx';
import { CampaignList } from './components/CampaignList.jsx';
import { CampaignModal } from './components/CampaignModal.jsx';

function App() {
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const queryClient = useQueryClient();

  const { data: campaignsData, isLoading: campaignsLoading, error: campaignsError } = useCampaigns();
  const { data: aggregateData, isLoading: aggregateLoading, error: aggregateError } = useAggregateInsights();
  const { data: campaignData, isLoading: campaignLoading, error: campaignError } = useCampaignDetails(selectedCampaignId);
  const { data: insightsData, isLoading: insightsLoading, error: insightsError } = useCampaignInsights(
    selectedCampaignId,
    !!selectedCampaignId
  );

  const filteredAndSortedCampaigns = useMemo(() => {
    if (!campaignsData?.campaigns) return [];

    let filtered = [...campaignsData.campaigns];

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (platformFilter !== 'all') {
      filtered = filtered.filter(c => 
        c.platforms?.some(p => p.toLowerCase() === platformFilter.toLowerCase())
      );
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'budget-desc') {
      filtered.sort((a, b) => (b.budget || 0) - (a.budget || 0));
    } else if (sortBy === 'daily-budget-desc') {
      filtered.sort((a, b) => (b.daily_budget || 0) - (a.daily_budget || 0));
    }

    return filtered;
  }, [campaignsData, searchTerm, statusFilter, platformFilter, sortBy]);

  const handleRefresh = async () => {
    const promises = [
      queryClient.invalidateQueries({ queryKey: ['aggregate-insights'] }),
      queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
    ];

    if (selectedCampaignId) {
      promises.push(
        queryClient.invalidateQueries({ queryKey: ['campaign', selectedCampaignId] }),
        queryClient.invalidateQueries({ queryKey: ['campaign-insights', selectedCampaignId] })
      );
    }

    await Promise.all(promises);
    setLastRefresh(new Date());
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Campaign Dashboard</h1>
        <div className="last-refresh">
          Last refresh: {lastRefresh.toLocaleTimeString()}
        </div>
      </header>

      <div className="aggregate-section">
        <AggregateKpis
          insights={aggregateData?.insights}
          isLoading={aggregateLoading}
          error={aggregateError}
        />
      </div>

      <div className="main-content">
        <div className="campaigns-panel">
          <CampaignFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            platformFilter={platformFilter}
            onPlatformChange={setPlatformFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <CampaignList
            campaigns={filteredAndSortedCampaigns}
            selectedId={selectedCampaignId}
            onSelect={setSelectedCampaignId}
            isLoading={campaignsLoading}
            error={campaignsError}
          />
        </div>
      </div>

      <CampaignModal
        campaign={campaignData?.campaign}
        insights={insightsData?.insights}
        isLoading={campaignLoading || insightsLoading}
        error={campaignError || insightsError}
        onRefresh={handleRefresh}
        isRefreshing={campaignLoading || insightsLoading}
        isOpen={!!selectedCampaignId}
        onClose={() => setSelectedCampaignId(null)}
      />
    </div>
  );
}

export default App;