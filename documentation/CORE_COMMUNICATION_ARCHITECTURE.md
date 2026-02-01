# GRACE X FILM - Core Communication System Architecture

## Overview

This document defines the technical architecture for the **Core Communication + Call Sheet + Schedule Distribution System**.

---

## System Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CORE CONTROLLER                                │
│  (Single Source of Truth)                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│   │   Crew DB    │  │  Call Sheet  │  │   Schedule   │                 │
│   │   Service    │  │   Service    │  │   Service    │                 │
│   └──────────────┘  └──────────────┘  └──────────────┘                 │
│          │                 │                 │                          │
│          └────────────────┼─────────────────┘                          │
│                           │                                             │
│                    ┌──────▼──────┐                                      │
│                    │   DISPATCH   │                                      │
│                    │    ENGINE    │  ◄── ONE BUTTON                     │
│                    └──────┬──────┘                                      │
│                           │                                             │
│          ┌────────────────┼────────────────┐                           │
│          │                │                │                            │
│   ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐                   │
│   │    Push     │  │   Email     │  │    SMS      │                   │
│   │  Notifier   │  │   Notifier  │  │  Notifier   │                   │
│   └─────────────┘  └─────────────┘  └─────────────┘                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT APPLICATIONS                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │
│   │  Production     │    │   Department    │    │   Mobile App    │    │
│   │  Office (Web)   │    │   UI (Web)      │    │   (Crew)        │    │
│   └─────────────────┘    └─────────────────┘    └─────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Backend Services

### 1. Crew Database Service
**Location:** `server/services/crew.js`

**Responsibilities:**
- CRUD operations for crew members
- Query by department, unit, status
- Permission management
- Contact method resolution

**Key Endpoints:**
```
GET    /api/crew                    - List all active crew
GET    /api/crew/:id                - Get crew member
POST   /api/crew                    - Add crew member
PUT    /api/crew/:id                - Update crew member
DELETE /api/crew/:id                - Deactivate crew member
GET    /api/crew/department/:dept   - Get crew by department
GET    /api/crew/unit/:unit         - Get crew by unit
```

---

### 2. Call Sheet Service
**Location:** `server/services/callsheet.js`

**Responsibilities:**
- Create and version call sheets
- Generate department-specific views
- Track changes (delta)
- Manage approval workflow

**Key Endpoints:**
```
GET    /api/callsheet                     - List call sheets
GET    /api/callsheet/:id                 - Get call sheet
GET    /api/callsheet/:id/department/:dept - Get department view
POST   /api/callsheet                     - Create call sheet
PUT    /api/callsheet/:id                 - Update call sheet
POST   /api/callsheet/:id/approve         - Approve call sheet
GET    /api/callsheet/:id/delta           - Get change summary
```

---

### 3. Schedule Service
**Location:** `server/services/schedule.js`

**Responsibilities:**
- Manage master schedule
- Detect changes and generate Change Events
- Calculate impact analysis
- Maintain version history

**Key Endpoints:**
```
GET    /api/schedule                 - Get current schedule
GET    /api/schedule/:id             - Get schedule version
PUT    /api/schedule                 - Update schedule
GET    /api/schedule/day/:date       - Get specific day
POST   /api/schedule/lock            - Lock schedule
```

---

### 4. Dispatch Engine
**Location:** `server/services/dispatch.js`

**Responsibilities:**
- ONE-BUTTON dispatch logic
- Recipient calculation
- Multi-channel delivery (push, email, SMS)
- Delivery tracking and retry
- Stats and reporting

**Key Endpoints:**
```
POST   /api/dispatch                 - DISPATCH CALL SHEET / UPDATE
GET    /api/dispatch/:id             - Get dispatch status
GET    /api/dispatch/:id/recipients  - Get recipient delivery status
POST   /api/dispatch/:id/retry       - Retry failed deliveries
```

---

### 5. Change Event Service
**Location:** `server/services/change-events.js`

**Responsibilities:**
- Detect and log changes
- Run impact analysis (which departments affected)
- Generate automatic flags
- Link to dispatch events

**Key Endpoints:**
```
GET    /api/changes                  - List recent changes
GET    /api/changes/:id              - Get change details
GET    /api/changes/:id/impacts      - Get impact analysis
POST   /api/changes/:id/acknowledge  - Acknowledge change
```

---

## Frontend Components

### 1. Core Operator Dashboard
**Location:** `modules/core-dashboard.html`

**Features:**
- Crew overview panel
- Call sheet editor
- Schedule view
- **ONE-BUTTON DISPATCH** (prominent)
- Dispatch history and stats
- Active notifications

---

### 2. Department UI (Template)
**Location:** `modules/department-ui.html`

**Standard Panels (All Departments):**

1. **Call Sheet Panel** (Always Visible, Top Priority)
   - Latest call sheet with priority colour coding
   - Version + timestamp
   - Delta summary ("What changed")
   - Department-specific notes highlighted

2. **Notifications/Alerts Panel**
   - New updates (push received)
   - Schedule changes
   - Action-required notices
   - Emergency alerts

3. **Department Documents Section**
   - Risk assessments
   - Method statements
   - Start forms
   - Checklists
   - Department-specific templates

---

### 3. Mobile App Views
**Location:** `assets/js/mobile/`

**Screens:**
- Home (latest call sheet, alerts)
- Call Sheet Detail
- Notifications
- Documents
- Profile / Settings

---

## Data Flow: ONE-BUTTON DISPATCH

```
┌─────────────────────────────────────────────────────────────────┐
│  Core Operator clicks "DISPATCH CALL SHEET"                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. Validate call sheet status (must be approved)               │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Query Crew DB: Get all active crew with callEligibility     │
│     - Filter by department if targeted dispatch                 │
│     - Apply notification rules                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. For each recipient, determine delivery method:              │
│     - Primary: app push notification                            │
│     - Fallback: email, then SMS                                 │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Create Dispatch Event record                                │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Send notifications (parallel):                              │
│     - FCM/APNs push                                             │
│     - Email via SendGrid/SES                                    │
│     - SMS via Twilio (if enabled)                               │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Update recipient delivery status                            │
│     - Track: sent → delivered → read                            │
│     - Retry failed after 30s, 2m, 10m                           │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. Return dispatch stats to Core Operator                      │
│     - Total recipients                                          │
│     - Sent / Delivered / Failed                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Schedule Change Propagation

```
┌─────────────────────────────────────────────────────────────────┐
│  Schedule updated (e.g., location changes to river)             │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Change Event Service detects change                            │
│  Creates ChangeEvent record                                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Impact Analysis runs:                                          │
│  - Location type: water → flag water hazards                    │
│  - Wardrobe: clothing change required                           │
│  - Camera: water protection needed                              │
│  - Sound: water noise considerations                            │
│  - Safety: drowning risk flagged                                │
│  - Transport: access route changes                              │
│  - Rigging: anchor points / load paths affected                 │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Generate department-specific summaries:                        │
│  "What you need to know"                                        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Core Operator reviews impacts                                  │
│  Confirms dispatch → ONE BUTTON                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Offline Handling

```
┌─────────────────────────────────────────────────────────────────┐
│  Mobile App Offline Strategy                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Cache latest call sheet locally (IndexedDB / SQLite)        │
│                                                                  │
│  2. On network loss:                                            │
│     - Display cached call sheet with "Offline" indicator        │
│     - Queue any acknowledgements                                │
│                                                                  │
│  3. On network restore:                                         │
│     - Sync queued actions                                       │
│     - Pull latest call sheet                                    │
│     - Show delta if version changed                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Model

| Role | Can Dispatch | Can Edit Call Sheets | Can Manage Crew | Can View All |
|------|-------------|---------------------|-----------------|--------------|
| Core Operator | ✓ | ✓ | ✓ | ✓ |
| Production Manager | ✓ | ✓ | ✓ | ✓ |
| 1st AD | ✓ | ✓ | ✗ | ✓ |
| 2nd AD | ✓ | ✓ | ✗ | ✓ |
| Department Head | ✗ | Dept only | ✗ | Dept only |
| Crew Member | ✗ | ✗ | ✗ | Own only |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JS (existing GRACE X stack) |
| Backend | Node.js + Express |
| Database | JSON files (MVP) → PostgreSQL (production) |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Email | SendGrid or AWS SES |
| SMS | Twilio (optional) |
| Real-time | WebSocket (Socket.io) |
| Hosting | Cloudflare Workers + Pages |

---

## File Structure

```
server/
├── services/
│   ├── crew.js
│   ├── callsheet.js
│   ├── schedule.js
│   ├── dispatch.js
│   └── change-events.js
├── routes/
│   ├── crew.routes.js
│   ├── callsheet.routes.js
│   ├── schedule.routes.js
│   └── dispatch.routes.js
└── server.js

config/
├── schemas/
│   ├── crew_member.schema.json
│   ├── call_sheet.schema.json
│   ├── dispatch_event.schema.json
│   ├── schedule.schema.json
│   ├── change_event.schema.json
│   └── department.schema.json
└── departments.json

modules/
├── core-dashboard.html
├── department-ui.html
└── callsheets.html (existing, to upgrade)

assets/
├── js/
│   ├── core/
│   │   ├── crew-manager.js
│   │   ├── callsheet-editor.js
│   │   ├── dispatch-controller.js
│   │   └── schedule-viewer.js
│   └── components/
│       ├── callsheet-panel.js
│       ├── notification-panel.js
│       └── document-panel.js
└── css/
    ├── callsheet.css
    └── notifications.css
```

---

## Next Steps

1. **Implement backend services** (crew.js, callsheet.js, dispatch.js)
2. **Build Core Dashboard UI** with dispatch button
3. **Create Department UI template** with standard panels
4. **Integrate push notifications** (FCM setup)
5. **Build mobile views** (responsive or PWA)
6. **Test end-to-end dispatch flow**

---

*This document is part of the GRACE X Film Production Suite canonical architecture.*
