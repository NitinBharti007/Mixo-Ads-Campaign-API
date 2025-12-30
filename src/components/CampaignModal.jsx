import { KpiCard } from './KpiCard.jsx';
import { LiveStream } from './LiveStream.jsx';
import { useState, useCallback, useEffect } from 'react';

export function CampaignModal({ campaign, insights, isLoading, error, onRefresh, isRefreshing, isOpen, onClose }) {
  const [liveMode, setLiveMode] = useState(false);
  const [liveInsights, setLiveInsights] = useState(null);

  const handleLiveUpdate = useCallback((data) => {
    if (data.insights) {
      setLiveInsights(data.insights);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const displayInsights = liveMode && liveInsights ? liveInsights : insights;

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{campaign?.name || 'Campaign Details'}</h2>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 5L5 15M5 5l10 10" />
              </svg>
            </button>
          </div>

          <div className="modal-body">
            {isLoading && !campaign && (
              <div className="loading">
                <div>Loading campaign details...</div>
              </div>
            )}

            {error && !isLoading && (
              <div className="error">
                {error.status === 404 ? (
                  <>
                    <h3>Campaign Not Found</h3>
                    <p>The selected campaign could not be found.</p>
                  </>
                ) : (
                  <>
                    <p>Error loading campaign details</p>
                    <button onClick={onRefresh}>Retry</button>
                  </>
                )}
              </div>
            )}

            {campaign && !error && (
              <>
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
                    <div className="insights-header">
                      <h3>Campaign Insights</h3>
                      <div className="insights-actions">
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
                        <button onClick={onRefresh} disabled={isRefreshing} className={isRefreshing ? 'refreshing' : ''}>
                          {isRefreshing ? (
                            <>
                              <span className="refresh-spinner"></span>
                              Refreshing...
                            </>
                          ) : (
                            'Refresh'
                          )}
                        </button>
                      </div>
                    </div>
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}