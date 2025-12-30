export function CampaignFilters({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusChange, 
  platformFilter, 
  onPlatformChange, 
  sortBy, 
  onSortChange 
}) {
  return (
    <div className="campaign-filters">
      <div className="filters-header">
        <h3>Filters & Search</h3>
      </div>
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">Search</label>
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Platform</label>
          <select
            value={platformFilter}
            onChange={(e) => onPlatformChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Platforms</option>
            <option value="meta">Meta</option>
            <option value="google">Google</option>
            <option value="linkedin">LinkedIn</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="budget-desc">Budget (High to Low)</option>
            <option value="daily-budget-desc">Daily Budget (High to Low)</option>
          </select>
        </div>
      </div>
    </div>
  );
}