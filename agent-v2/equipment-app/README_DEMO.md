# Equipment Management System - Internal Demo Guide

Welcome to the internal demo of the **Vanguard EMS MVP**. This application is currently in a "Hybrid Demo" state, optimized for high-end visual presentation and core workflow demonstration.

## 🚀 Presentation Steps

1. **Dashboard Overview**: Start here to show the "Vanguard HUD" aesthetic. Point out the OEE (Operational Efficiency) and active maintenance alerts.
2. **Equipment List**: Navigate to "Equipment List" to show the asset registry. Demonstrate the filtering and status badges.
3. **Maintenance Management**: Show the lifecycle tracking and scheduled preventive maintenance tasks.
4. **Spare Parts**: Demonstrate the inventory management and low-stock indicators.

## 🛠 Required Setup for Real Data

Once the visual demo is approved, follow these steps to connect to a live Supabase backend:

1. **Supabase Setup**:
   - Create a new project in [Supabase](https://supabase.com).
   - Run the [schema.sql](../agent/domain/schema.sql) in the SQL Editor.
2. **Configuration**:
   - Copy `.env.example` to `.env`.
   - Fill in your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. **Data Fetching**:
   - Update component `useEffect` hooks to call the methods in `src/services/supabase.ts`.

## 📦 Tech Stack
- Vite + React + TypeScript
- Tailwind CSS
- Lucide React Icons
- Supabase Client (Ready for connection)
