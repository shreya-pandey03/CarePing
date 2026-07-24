export interface RealtimeEvent<T = unknown> {
  userId: string;
  type: string;
  payload: T;
}