import { KpiCard } from './KpiCard.jsx';
import { LiveStream } from './LiveStream.jsx';
import { useState, useCallback } from 'react';

export function CampaignDetails({ campaign, insights, isLoading, error, onRefresh, isRefreshing }) {
  const [liveMode, setLiveMode] = useState(false);
  const [liveInsights, setLiveInsights] = useState(null);

  const handleLiveUpdate = useCallback((data) => {
    if (data.insights) {
      setLiveInsights(data.insights);
    }
  }, []);

  const displayInsights = liveMode && liveInsights ? liveInsights : insights;

  if (isLoading && !insights) {
    return <div className="campaign-details loading">Loading campaign details...</div>;
  }

  if (error) {
    if (error.status === 404) {
      return (
        <div className="campaign-details error">
          <h2>Campaign Not Found</h2>
          <p>The selected campaign could not be found.</p>
        </div>
      );
    }
    return (
      <div className="campaign-details error">
        <p>Error loading campaign details</p>
        <button onClick={onRefresh}>Retry</button>
      </div>
    );
  }

  if (!campaign) {
    return <div className="campaign-details empty">Select a campaign to view details</div>;
  }

  return (
    <div className="campaign-details">
      <div className="campaign-details-header">
        <h2>{campaign.name}</h2>
        <div className="campaign-actions">
          <label className="live-toggle">
            <input
              type="checkbox"
              checked={liveMode}
              onChange={(e) => setLiveMode(e.target.checked)}
            />
            <span className={liveMode ? 'live-indicator' : ''}>
              {liveMode ? 'Live' : 'Live Mode'}
            </span>
          </label>
          <button onClick={onRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <LiveStream
        campaignId={campaign.id}
        enabled={liveMode}
        onUpdate={handleLiveUpdate}
      />

      <div className="campaign-info">
        <div className="info-row">
          <span className="info-label">ID:</span>
          <span className="info-value">{campaign.id}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Status:</span>
          <span className={`status-badge status-${campaign.status}`}>
            {campaign.status}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Platforms:</span>
          <span className="info-value">{campaign.platforms?.join(', ') || 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Budget:</span>
          <span className="info-value">${campaign.budget?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Daily Budget:</span>
          <span className="info-value">${campaign.daily_budget?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Created At:</span>
          <span className="info-value">
            {new Date(campaign.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      {displayInsights && (
        <div className="campaign-insights">
          <h3>Campaign Insights</h3>
          {displayInsights.timestamp && (
            <div className="insights-timestamp">
              Updated at: {new Date(displayInsights.timestamp).toLocaleString()}
            </div>
          )}
          <div className="insights-grid">
            <KpiCard label="Impressions" value={displayInsights.impressions} />
            <KpiCard label="Clicks" value={displayInsights.clicks} />
            <KpiCard label="Conversions" value={displayInsights.conversions} />
            <KpiCard label="Spend" value={displayInsights.spend} format="currency" />
            <KpiCard label="CTR" value={displayInsights.ctr} format="percent" />
            <KpiCard label="CPC" value={displayInsights.cpc} format="currency" />
            <KpiCard label="Conversion Rate" value={displayInsights.conversion_rate} format="percent" />
          </div>
        </div>
      )}

      {!displayInsights && !isLoading && (
        <div className="no-insights">No insights available for this campaign</div>
      )}
    </div>
  );
}