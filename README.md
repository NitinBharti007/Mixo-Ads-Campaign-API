# Campaign Performance Dashboard

A modern, responsive React dashboard for monitoring and analyzing advertising campaign performance with real-time updates, filtering, and detailed insights.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [How It Works](#how-it-works)
- [API Integration](#api-integration)
- [Components Guide](#components-guide)
- [Key Features Explained](#key-features-explained)
- [Usage Guide](#usage-guide)

## 🎯 Overview

This dashboard provides a comprehensive view of advertising campaigns with:
- **Aggregate KPIs** - Overview of all campaigns
- **Campaign List** - Filterable and sortable list of campaigns
- **Campaign Details** - Detailed view in a modal popup
- **Real-time Updates** - Live metrics via Server-Sent Events (SSE)
- **Rate Limiting** - Handles API rate limits gracefully
- **Responsive Design** - Works on desktop and mobile devices

## ✨ Features

- ✅ **Real-time Metrics** - Live updates via SSE stream
- ✅ **Advanced Filtering** - Search, status, platform, and sorting options
- ✅ **Rate Limit Handling** - Automatic retry with exponential backoff
- ✅ **Request Cancellation** - Cancels in-flight requests on navigation
- ✅ **Caching** - Smart caching with React Query
- ✅ **Error Handling** - Graceful error states with retry options
- ✅ **Dark Theme** - Modern dark theme UI
- ✅ **Mobile Responsive** - Optimized for all screen sizes
- ✅ **Loading States** - Clear loading indicators
- ✅ **Modal Details** - Campaign details in a popup modal

## 🛠 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TanStack React Query** - Data fetching, caching, and state management
- **JavaScript** - Programming language (no TypeScript)
- **CSS3** - Styling with CSS variables for theming
- **Fetch API** - HTTP client with custom wrapper
- **Server-Sent Events (SSE)** - Real-time data streaming

## 📁 Project Structure

```
Mixo-ads/
├── src/
│   ├── api/
│   │   ├── client.js          # HTTP client with rate limiting & retry logic
│   │   └── campaigns.js       # API endpoint functions
│   ├── hooks/
│   │   ├── useCampaigns.js           # Hook for fetching all campaigns
│   │   ├── useAggregateInsights.js   # Hook for aggregate KPIs
│   │   ├── useCampaignDetails.js    # Hook for single campaign
│   │   └── useCampaignInsights.js   # Hook for campaign insights
│   ├── components/
│   │   ├── AggregateKpis.jsx      # Top KPI cards display
│   │   ├── CampaignFilters.jsx    # Search and filter controls
│   │   ├── CampaignList.jsx       # List of campaigns
│   │   ├── CampaignModal.jsx      # Modal popup for details
│   │   ├── KpiCard.jsx            # Reusable KPI card component
│   │   └── LiveStream.jsx         # SSE connection handler
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # Application entry point
│   └── styles.css                  # Global styles with dark theme
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd Mixo-ads
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The app will be available at `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🔄 How It Works

### Data Flow

```
1. App Loads
   ↓
2. React Query Hooks Fetch Data
   ├── useCampaigns() → GET /campaigns
   └── useAggregateInsights() → GET /campaigns/insights
   ↓
3. Data Cached by React Query
   ↓
4. User Interacts
   ├── Filters/Searches → useMemo recalculates filtered list
   ├── Clicks Campaign → Sets selectedCampaignId
   └── Opens Modal → Fetches campaign details & insights
   ↓
5. Real-time Updates (if Live Mode enabled)
   └── SSE Stream → Updates insights in real-time
```

### Component Hierarchy

```
App
├── Header (title + last refresh time)
├── AggregateKpis (9 KPI cards)
└── Main Content
    └── Campaigns Panel
        ├── CampaignFilters (search, filters, sort)
        └── CampaignList (clickable campaign items)
    └── CampaignModal (opens when campaign selected)
        ├── Campaign Info
        ├── Campaign Insights (KPI cards)
        └── Live Mode Toggle
```

## 🔌 API Integration

### Base URL
```
https://mixo-fe-backend-task.vercel.app
```

### Endpoints

| Endpoint | Method | Description | Returns |
|----------|--------|-------------|---------|
| `/campaigns` | GET | List all campaigns | `{ campaigns: Campaign[], total: number }` |
| `/campaigns/{id}` | GET | Get single campaign | `{ campaign: Campaign }` |
| `/campaigns/insights` | GET | Aggregate insights | `{ insights: AggregateInsights }` |
| `/campaigns/{id}/insights` | GET | Campaign insights | `{ insights: CampaignInsights }` |
| `/campaigns/{id}/insights/stream` | SSE | Real-time metrics stream | Server-Sent Events |

### Rate Limiting

- **Limit**: 10 requests per minute
- **429 Response**: Contains `retry_after` (seconds)
- **Auto Retry**: Up to 2 retries with delay from `retry_after`

### Request Cancellation

- Uses `AbortController` to cancel requests
- Automatically cancels when:
  - Component unmounts
  - User switches campaigns quickly
  - Query is disabled

## 🧩 Components Guide

### 1. **AggregateKpis Component**
Displays 9 key performance indicators at the top:
- Total Campaigns
- Active Campaigns
- Total Impressions, Clicks, Conversions
- Total Spend
- Average CTR, CPC, Conversion Rate

**Location**: `src/components/AggregateKpis.jsx`

### 2. **CampaignFilters Component**
Provides filtering and sorting controls:
- **Search Input**: Filter by campaign name
- **Status Filter**: All, Active, Paused, Completed
- **Platform Filter**: All, Meta, Google, LinkedIn, Other
- **Sort Options**: Newest, Budget (High to Low), Daily Budget (High to Low)

**Location**: `src/components/CampaignFilters.jsx`

### 3. **CampaignList Component**
Displays the list of campaigns with:
- Campaign name
- Status badge (color-coded)
- Platforms
- Daily budget
- Clickable items (opens modal)

**States**: Loading, Error, Empty, Success

**Location**: `src/components/CampaignList.jsx`

### 4. **CampaignModal Component**
Modal popup showing detailed campaign information:
- Campaign details (ID, status, platforms, budgets, created date)
- Campaign insights (7 KPI cards)
- Live Mode toggle (enables SSE stream)
- Manual refresh button (with loading spinner)

**Features**:
- ESC key to close
- Click outside to close
- Prevents body scroll when open

**Location**: `src/components/CampaignModal.jsx`

### 5. **LiveStream Component**
Handles Server-Sent Events connection:
- Connects to SSE endpoint when Live Mode enabled
- Updates insights in real-time
- Max 2 reconnection attempts
- Cleans up on unmount

**Location**: `src/components/LiveStream.jsx`

### 6. **KpiCard Component**
Reusable card for displaying KPIs:
- Supports 3 formats: number, currency, percent
- Currency: 2 decimal places
- Percent: 2 decimal places with % symbol
- Number: Locale-formatted

**Location**: `src/components/KpiCard.jsx`

## 🔑 Key Features Explained

### 1. **Rate Limiting Handling**

**Problem**: API limits to 10 requests/minute, returns 429 with `retry_after`.

**Solution**: 
- Custom HTTP client (`src/api/client.js`)
- Detects 429 status code
- Reads `retry_after` from response
- Waits specified seconds before retry
- Maximum 2 retries

**Code Flow**:
```javascript
if (response.status === 429 && retryCount < maxRetries) {
  const retryAfter = payload.retry_after || 1;
  await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
  retryCount++;
  continue;
}
```

### 2. **Request Cancellation**

**Problem**: Fast navigation causes unnecessary requests.

**Solution**:
- React Query passes `signal` (AbortController) to query functions
- API functions accept and pass `signal` to fetch
- When query is cancelled, fetch aborts automatically

**Implementation**:
```javascript
// In hook
queryFn: ({ signal }) => listCampaigns(signal)

// In API function
export async function listCampaigns(signal) {
  return client.get('/campaigns', { signal });
}
```

### 3. **Caching Strategy**

**React Query Configuration**:
- **Campaigns List**: `staleTime: 60s` (stays fresh for 1 minute)
- **Aggregate Insights**: `staleTime: 30s` (stays fresh for 30 seconds)
- **Campaign Details**: No staleTime (fetches on demand)
- **No Aggressive Polling**: Relies on manual refresh or SSE

**Benefits**:
- Reduces API calls
- Faster UI updates
- Automatic deduplication

### 4. **Real-time Updates (SSE)**

**How It Works**:
1. User enables "Live Mode" toggle
2. `LiveStream` component connects to SSE endpoint
3. Server sends updates as events
4. Component parses JSON and updates state
5. UI reflects changes immediately

**Connection Management**:
- Connects only when enabled
- Closes on disable or unmount
- Max 2 reconnection attempts
- Shows error if connection fails

### 5. **Filtering & Sorting**

**Implementation**:
- Uses `useMemo` for performance
- Filters in sequence: search → status → platform
- Sorts based on selected option
- Recalculates only when dependencies change

**Filter Logic**:
```javascript
// Search filter
filtered = filtered.filter(c => 
  c.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// Status filter
if (statusFilter !== 'all') {
  filtered = filtered.filter(c => c.status === statusFilter);
}

// Platform filter
if (platformFilter !== 'all') {
  filtered = filtered.filter(c => 
    c.platforms?.some(p => p.toLowerCase() === platformFilter.toLowerCase())
  );
}
```

## 📖 Usage Guide

### Viewing Campaigns

1. **View All Campaigns**
   - Campaigns load automatically on page load
   - Scroll through the list on the left

2. **Filter Campaigns**
   - Use search box to find by name
   - Select status from dropdown (Active, Paused, Completed)
   - Select platform (Meta, Google, LinkedIn, Other)
   - Choose sort option (Newest, Budget, Daily Budget)

3. **View Campaign Details**
   - Click any campaign from the list
   - Modal opens with campaign information
   - View insights (impressions, clicks, conversions, etc.)

### Using Live Mode

1. **Enable Live Updates**
   - Open a campaign modal
   - Toggle "Live Mode" switch
   - Insights update in real-time via SSE

2. **Manual Refresh**
   - Click "Refresh" button in modal
   - Spinner shows while refreshing
   - Button disabled during refresh

### Understanding KPIs

**Aggregate KPIs** (Top Section):
- Overview of all campaigns combined
- Updates every 30 seconds (or on manual refresh)

**Campaign Insights** (In Modal):
- Specific metrics for selected campaign
- Updates in real-time if Live Mode enabled
- Shows timestamp of last update

### Error Handling

**If Campaigns Don't Load**:
- Check network connection
- Verify API is accessible
- Click "Retry" button if shown

**If Rate Limited**:
- App automatically retries after delay
- Wait for retry to complete
- Reduce manual refresh frequency

**If Campaign Not Found**:
- Campaign may have been deleted
- Select a different campaign
- Refresh the campaigns list

## 🎨 Styling & Theme

### Dark Theme

The app uses a dark theme with:
- Dark backgrounds (`--background`, `--card`)
- Light text (`--foreground`)
- Accent colors for primary actions
- Color-coded status badges

### CSS Variables

All colors defined in `:root` using HSL values:
```css
--background: 222.2 47.4% 11.2%;
--foreground: 210 40% 98%;
--primary: 217.2 91.2% 59.8%;
--muted: 217.2 32.6% 17.5%;
```

### Responsive Design

- **Desktop**: Full-width layout with side-by-side filters
- **Mobile** (< 768px):
  - Filters stack vertically
  - Modal slides up from bottom
  - Info rows stack vertically
  - Optimized touch targets

## 🔧 Customization

### Changing API Base URL

Edit `src/api/client.js`:
```javascript
const API_BASE_URL = 'https://your-api-url.com';
```

### Adjusting Cache Times

Edit hooks in `src/hooks/`:
```javascript
staleTime: 60 * 1000, // Change to desired milliseconds
```

### Modifying Theme Colors

Edit CSS variables in `src/styles.css`:
```css
:root {
  --primary: 217.2 91.2% 59.8%; /* Change primary color */
  --background: 222.2 47.4% 11.2%; /* Change background */
}
```

## 🐛 Troubleshooting

### Modal Not Centering
- Ensure `min-height` is set on `.modal-content`
- Check that `modal-container` uses flexbox centering

### Spinner Not Showing
- Verify button has `refreshing` class when `isRefreshing` is true
- Check that spinner CSS animation is defined

### SSE Not Connecting
- Verify Live Mode is enabled
- Check browser console for errors
- Ensure SSE endpoint is accessible

### Filters Not Working
- Check that `useMemo` dependencies include all filter states
- Verify filter logic in `App.jsx`

## 📝 Code Examples

### Adding a New Filter

1. Add state in `App.jsx`:
```javascript
const [newFilter, setNewFilter] = useState('all');
```

2. Add to `useMemo`:
```javascript
if (newFilter !== 'all') {
  filtered = filtered.filter(c => c.property === newFilter);
}
```

3. Add to `CampaignFilters` component:
```javascript
<select value={newFilter} onChange={(e) => onNewFilterChange(e.target.value)}>
  <option value="all">All Options</option>
  <option value="option1">Option 1</option>
</select>
```

### Adding a New KPI

1. Update `AggregateKpis.jsx`:
```javascript
<KpiCard label="New KPI" value={insights.new_kpi} format="number" />
```

2. Ensure API returns the new field in insights response

## 🤝 Contributing

This is a project-specific dashboard. For modifications:
1. Follow existing code structure
2. Maintain error handling patterns
3. Keep components modular
4. Test on mobile devices
5. Ensure rate limiting is respected

## 📄 License

This project is for internal use.

## 🙏 Acknowledgments

- Built with React and Vite
- Styled with shadcn-inspired dark theme
- Uses TanStack React Query for data management

---

**Need Help?** Check the code comments or review the component files for detailed implementation.

