import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Waypoint, SolverResult } from '../lib/quantumSolver';
import type { TrafficData } from '../lib/trafficAI';

export interface AppState {
  waypoints: Waypoint[];
  optimizationMode: 'classic' | 'quantum';
  trafficEnabled: boolean;
  isSolving: boolean;
  solverResult: SolverResult | null;
  trafficData: TrafficData | null;
  trafficHour: number;
  solverProgress: number;
  lastUpdated: number;
  routeHistory: Array<{ id: string; waypoints: Waypoint[]; distance: number; timestamp: number }>;

  setWaypoints: (waypoints: Waypoint[]) => void;
  addWaypoint: (waypoint: Waypoint) => void;
  removeWaypoint: (id: string) => void;
  reorderWaypoints: (from: number, to: number) => void;
  setOptimizationMode: (mode: 'classic' | 'quantum') => void;
  setTrafficEnabled: (enabled: boolean) => void;
  setIsSolving: (solving: boolean) => void;
  setSolverResult: (result: SolverResult | null) => void;
  setTrafficData: (data: TrafficData | null) => void;
  setTrafficHour: (hour: number) => void;
  setSolverProgress: (progress: number) => void;
  addToRouteHistory: (waypoints: Waypoint[], distance: number) => void;
  clearRouteHistory: () => void;
  reset: () => void;
}

const MUMBAI_WAYPOINTS: Waypoint[] = [
  { id: '1', lat: 18.922, lng: 72.8347, label: 'Gateway of India' },
  { id: '2', lat: 19.033, lng: 72.8197, label: 'Sea Link' },
  { id: '3', lat: 18.9398, lng: 72.8354, label: 'CST Station' },
  { id: '4', lat: 19.0988, lng: 72.8264, label: 'Juhu Beach' },
  { id: '5', lat: 19.1073, lng: 72.9087, label: 'Powai Lake' },
];

const initialState: Omit<AppState, keyof {
  setWaypoints: never;
  addWaypoint: never;
  removeWaypoint: never;
  reorderWaypoints: never;
  setOptimizationMode: never;
  setTrafficEnabled: never;
  setIsSolving: never;
  setSolverResult: never;
  setTrafficData: never;
  setTrafficHour: never;
  setSolverProgress: never;
  addToRouteHistory: never;
  clearRouteHistory: never;
  reset: never;
}> = {
  waypoints: MUMBAI_WAYPOINTS,
  optimizationMode: 'quantum',
  trafficEnabled: true,
  isSolving: false,
  solverResult: null,
  trafficData: null,
  trafficHour: new Date().getHours(),
  solverProgress: 0,
  lastUpdated: Date.now(),
  routeHistory: [],
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setWaypoints: (waypoints) => set({ waypoints, lastUpdated: Date.now() }),
      addWaypoint: (waypoint) =>
        set((state) => ({
          waypoints: state.waypoints.length < 10 ? [...state.waypoints, waypoint] : state.waypoints,
          lastUpdated: Date.now(),
        })),
      removeWaypoint: (id) =>
        set((state) => ({
          waypoints: state.waypoints.filter((w) => w.id !== id),
          solverResult: null,
          lastUpdated: Date.now(),
        })),
      reorderWaypoints: (from, to) =>
        set((state) => {
          const newWaypoints = [...state.waypoints];
          const [removed] = newWaypoints.splice(from, 1);
          newWaypoints.splice(to, 0, removed);
          return { waypoints: newWaypoints, lastUpdated: Date.now() };
        }),
      setOptimizationMode: (mode) => set({ optimizationMode: mode, lastUpdated: Date.now() }),
      setTrafficEnabled: (enabled) => set({ trafficEnabled: enabled, lastUpdated: Date.now() }),
      setIsSolving: (solving) => set({ isSolving: solving }),
      setSolverResult: (result) => set({ solverResult: result, lastUpdated: Date.now() }),
      setTrafficData: (data) => set({ trafficData: data }),
      setTrafficHour: (hour) => set({ trafficHour: hour, lastUpdated: Date.now() }),
      setSolverProgress: (progress) => set({ solverProgress: progress }),
      
      addToRouteHistory: (waypoints, distance) =>
        set((state) => ({
          routeHistory: [
            {
              id: `route-${Date.now()}`,
              waypoints,
              distance,
              timestamp: Date.now(),
            },
            ...state.routeHistory.slice(0, 9),
          ],
        })),
      
      clearRouteHistory: () => set({ routeHistory: [] }),
      
      reset: () => set({ ...initialState, trafficHour: new Date().getHours() }),
    }),
    {
      name: 'quantum-nav-store',
      version: 1,
    }
  )
);
