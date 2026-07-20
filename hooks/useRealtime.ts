import { useRealtimeStore } from "@/store/realtimeStore";

export function useRealtime() {
  return useRealtimeStore();
}