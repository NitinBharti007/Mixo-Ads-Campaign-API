import { KpiCard } from './KpiCard.jsx';

export function AggregateKpis({ insights, isLoading, error }) {
  if (isLoading) {
    return <div className="aggregate-kpis loading">Loading aggregate insights...</div>;
  }
  
  if (error) {
    return <div className="aggregate-kpis error">Error loading insights</div>;
  }
  
  if (!insights) {
    return null;
  }
  
  return (
    <div className="aggregate-kpis">
      <KpiCard label="Total Campaigns" value={insights.total_campaigns} />
      <KpiCard label="Active Campaigns" value={insights.active_campaigns} />
      <KpiCard label="Total Impressions" value={insights.total_impressions} />
      <KpiCard label="Total Clicks" value={insights.total_clicks} />
      <KpiCard label="Total Conversions" value={insights.total_conversions} />
      <KpiCard label="Total Spend" value={insights.total_spend} format="currency" />
      <KpiCard label="Avg CTR" value={insights.avg_ctr} format="percent" />
      <KpiCard label="Avg CPC" value={insights.avg_cpc} format="currency" />
      <KpiCard label="Avg Conversion Rate" value={insights.avg_conversion_rate} format="percent" />
    </div>
  );
}