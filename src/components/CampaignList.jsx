export function CampaignList({ campaigns, selectedId, onSelect, isLoading, error }) {
  if (isLoading) {
    return <div className="campaign-list loading">Loading campaigns...</div>;
  }
  
  if (error) {
    return (
      <div className="campaign-list error">
        <p>Error loading campaigns</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  
  if (!campaigns || campaigns.length === 0) {
    return <div className="campaign-list empty">No campaigns found</div>;
  }
  
  return (
    <div className="campaign-list">
      <div className="campaign-list-header">
        <h3>Campaigns ({campaigns.length})</h3>
      </div>
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className={`campaign-item ${selectedId === campaign.id ? 'selected' : ''}`}
          onClick={() => onSelect(campaign.id)}
        >
          <div className="campaign-item-header">
            <h3>{campaign.name}</h3>
            <span className={`status-badge status-${campaign.status}`}>
              {campaign.status}
            </span>
          </div>
          <div className="campaign-item-platforms">
            {campaign.platforms?.join(', ') || 'N/A'}
          </div>
          <div className="campaign-item-budget">
            Daily Budget: ${campaign.daily_budget?.toFixed(2) || '0.00'}
          </div>
        </div>
      ))}
    </div>
  );
}