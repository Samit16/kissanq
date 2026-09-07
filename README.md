# KisaanQ

## Predictive Procurement Queue & Smart Allocation System

KisaanQ predicts the actual procurement service window from changing centre conditions, then converts that prediction into an actionable departure recommendation for the farmer.

## Prototype

This is a rapid functional prototype for SIH problem statement 26032. It uses simulated procurement-centre events and local mock data to demonstrate dynamic ETA recalculation. No government, FCI, PFMS, Aadhaar, payment, WhatsApp, GPS, or other external integration is connected.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## 60-second demo

1. Open `/farmer` and note the initial ETA: **11:40 AM - 12:00 PM** and departure: **10:55 AM**.
2. Open `/operator` and observe the queue, active counters, and normal weighing stage.
3. Click **Report stage delay** or open `/operator/simulation` and choose **Introduce weighing delay**.
4. Watch the forecast update through the short `Updating forecast...` state.
5. Return to `/farmer` and observe the new ETA: **12:05 PM - 12:25 PM** and departure: **11:20 AM**.
6. Open the notification icon to show the farmer-facing prototype notification.
7. Use **Recover centre** or **Reset demo** to return to the starting state.

## Routes

- `/` landing / demo entry
- `/farmer` farmer dashboard
- `/farmer/booking` booking screen
- `/farmer/status` status confirmation destination
- `/operator` procurement centre dashboard
- `/operator/simulation` demo control panel
- `/notification` notification simulation

## Architecture

- `src/services/predictionEngine.js` contains the transparent deterministic prediction logic.
- `src/data/demoState.js` contains normal, delayed, and recovered mock centre states.
- `src/App.jsx` contains the shared local demo state and responsive screens.

The current formula uses `queueAhead`, `processingRate`, `travelTime`, and `buffer`. A production version can replace the mock state source with authorised centre event data without changing the farmer-facing prediction contract.

## Production roadmap

Prototype data
→ Pilot centre event data
→ Authorised government integrations
→ District-scale deployment
