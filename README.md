# WAR RISK PREDICTION - Frontend Integration & Development Guide

## Overview

This directory contains the **Next.js 14 / React 18** frontend web application for the **WAR RISK PREDICTION** system. 

The frontend provides an interactive, executive-grade 3D geospatial dashboard for real-time conflict telemetry, Country Instability Index (CII) tracking, bilateral aggression metrics, cascade contagion modeling, and strategic briefing analytics.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI & Logic**: React 18, TypeScript, Tailwind CSS, Lucide React Icons
- **Geospatial & 3D**: React Globe GL, Three.js, Deck.gl / MapLibre GL
- **State Management**: Zustand (`src/store/useDashboardState.ts`)
- **Data Fetching & Caching**: TanStack React Query (`@tanstack/react-query`)
- **Layout & Drag/Grid**: React Grid Layout

---

## Quick Start (Development Mode)

### 1. Prerequisites
- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm**: v9+ or **pnpm** / **yarn**

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the `frontend/` directory:

```ini
# Backend API Base URL (FastAPI)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Optional Mapbox Access Token (for custom tile styles)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.placeholder_token_for_map_tiles
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Directory & File Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root app layout & global providers
│   ├── page.tsx                # Primary 3D Globe Dashboard page
│   ├── globals.css             # Glassmorphism & HUD CSS themes
│   └── briefing/               # Executive Briefing sub-routes
├── src/
│   ├── components/
│   │   ├── chrome/             # TopNav, WorkspaceTabBar, PromoBanner
│   │   ├── common/             # Reusable UI widgets & buttons
│   │   ├── globe/              # Globe3D & DataLayerRegistry components
│   │   ├── views/              # BriefingView (Overview & Deep Analytics)
│   │   └── widgets/            # MapLayersPanel, SituationBrief, ForecastFeed
│   ├── data/
│   │   └── mockIntelligence.ts # Fallback telemetry & mock datasets
│   ├── lib/                    # API client helpers & utilities
│   ├── providers/              # React Query & React Context providers
│   └── store/
│       └── useDashboardState.ts # Centralized Zustand state store
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## Backend REST API Integration Specifications

The frontend interfaces with the **FastAPI backend** (running by default at `http://localhost:8000/api/v1`).

### 1. Country Instability Index (CII) Endpoints

| Endpoint | Method | Description | Response Model / Payload |
| :--- | :--- | :--- | :--- |
| `/api/v1/cii/latest` | `GET` | Retrieve latest CII scores for all in-scope countries | `Array<CIIScoreResponse>` |
| `/api/v1/cii/{country_code}` | `GET` | Historical CII scores for a target ISO-3 country (e.g. `YEM`, `UKR`, `USA`) | `Array<CIIScoreResponse>` (Query: `limit=30`) |
| `/api/v1/cii/model-info` | `GET` | Active model version, valuation metrics & feature importances | `ModelInfoResponse` |
| `/api/v1/cii/registry` | `GET` | Historical retrain runs, validation metrics & promotion status | `Array<ModelRegistryItem>` |

#### `CIIScoreResponse` Schema Example:
```json
{
  "country_code": "YEM",
  "score_date": "2026-08-01",
  "cii_score": 78.45,
  "model_version": "v2.4.0",
  "confidence_interval_low": 72.10,
  "confidence_interval_high": 84.80,
  "feature_snapshot": {
    "gdelt_event_volume": 1240,
    "fatalities_trailing_30d": 85,
    "sanction_intensity": 0.92
  },
  "computed_at": "2026-08-01T12:00:00Z"
}
```

---

### 2. Bilateral Aggression Endpoints

| Endpoint | Method | Description | Parameters |
| :--- | :--- | :--- | :--- |
| `/api/v1/aggression/matrix` | `GET` | Matrix of all bilateral aggression scores | Query: `data_source` (`gdelt_derived` \| `external_baseline`) |
| `/api/v1/aggression/{country_code}` | `GET` | Bilateral aggression pairs for a single country | Path: `country_code` (e.g., `USA`, `IND`) |
| `/api/v1/aggression/{country_a}/{country_b}` | `GET` | Pairwise score for two specific countries | Path: `country_a`, `country_b` |

#### `AggressionPairResponse` Schema Example:
```json
{
  "country_a": "SAU",
  "country_b": "YEM",
  "aggression_score": 84.2,
  "event_count": 342,
  "data_source": "gdelt_derived",
  "baseline_source": null,
  "baseline_data_year": null,
  "last_event_date": "2026-08-05",
  "computed_at": "2026-08-06T08:30:00Z"
}
```

---

### 3. Cascade Contagion Endpoints

| Endpoint | Method | Description | Parameters |
| :--- | :--- | :--- | :--- |
| `/api/v1/cascade/{country_code}` | `GET` | Cross-stream contagion scores for a source country | Path: `country_code`, Query: `window_days` (default `7`) |

#### Cascade Response Schema Example:
```json
{
  "country_code": "YEM",
  "window_days": 7,
  "total_pairs": 4,
  "pairs": [
    {
      "source_country": "YEM",
      "target_country": "SAU",
      "contagion_score": 0.87,
      "co_spike_count": 12,
      "source_spike_count": 15,
      "window_days": 7,
      "analysis_start_date": "2026-07-29",
      "analysis_end_date": "2026-08-05",
      "computed_at": "2026-08-06T00:00:00Z"
    }
  ]
}
```

---

### 4. Live Escalation Feed Endpoints

| Endpoint | Method | Description | Parameters |
| :--- | :--- | :--- | :--- |
| `/api/v1/live-feed/{region}` | `GET` | Live escalation feed for regional conflict events | Path: `region` (`india`, `usa`, `europe`, `middle_east`)<br/>Query: `window_hours` (default `24`), `bypass_cache` (`true`/`false`) |

---

## State Management (`useDashboardState.ts`)

The application state is managed centrally via **Zustand**. Key state elements include:

- **Camera & Viewport**: `lat`, `lon`, `zoom`, `view` (`global` | `regional` | `country`), `autoRotate`
- **Active Telemetry Layers**: `layers` array (e.g. `conflicts`, `bases`, `hotspots`, `nuclear`, `sanctions`, `contagionArcs`, `tradeRoutes`)
- **Pairwise Country Selection**: `selectedCountryA`, `selectedCountryB`
- **Cascade Simulation Source**: `cascadeSourceCountry`
- **Telemetry State**: `isLiveMode`, `isLoadingIntelligence`, `intelligenceData`, `intelligenceError`
- **URL Synchronization**:
  - `hydrateFromSearchParams(params)`: Deserializes active camera and layers from URL query params.
  - `toQueryString()`: Generates standard query string for instant URL sharing.

---

## Step-by-Step Integration Implementation Guide

### 1. Enable Live API Fetching in Components
To toggle between Mock Fallback data and Live API responses, check `isLiveMode` from `useDashboardState`:

```typescript
import { useEffect } from 'react';
import { useDashboardState } from '@/store/useDashboardState';

export function InstabilityWidget() {
  const isLiveMode = useDashboardState((s) => s.isLiveMode);
  const intelligenceData = useDashboardState((s) => s.intelligenceData);

  useEffect(() => {
    if (isLiveMode) {
      // Fetch live data from backend API
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/cii/latest`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Fetched live CII data:', data);
        })
        .catch((err) => console.error('Failed to fetch live CII:', err));
    }
  }, [isLiveMode]);

  return (
    <div>
      {/* Render intelligence data */}
    </div>
  );
}
```

### 2. Using React Query Pattern (Recommended)
For automatic caching, polling, and background refresh:

```typescript
import { useQuery } from '@tanstack/react-query';

export function useCIILatest() {
  return useQuery({
    queryKey: ['cii', 'latest'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cii/latest`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 30000, // Auto-refresh every 30s
  });
}
```

---

## Available Scripts

In the `frontend` directory, you can run:

- `npm run dev`: Starts the Next.js development server at `http://localhost:3000`.
- `npm run build`: Compiles and builds the production-ready Next.js application.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint to check for syntax and code style issues.
- `npm run type-check`: Runs TypeScript compiler (`tsc --noEmit`) to verify type safety.

---

## Troubleshooting & FAQ

- **CORS Error during development**:
  Ensure the FastAPI backend has `CORSMiddleware` configured with `allow_origins=["*"]` or includes `http://localhost:3000`.
- **Globe fails to render**:
  Ensure WebGL is supported by your browser. The Globe widget uses dynamic importing (`ssr: false`) to avoid server-side rendering issues.
- **Fallback Mock Data**:
  If the backend API is offline or unreachable, the frontend automatically falls back to `src/data/mockIntelligence.ts` so UI development and testing can proceed seamlessly.
