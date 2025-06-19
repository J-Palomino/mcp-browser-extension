export type MessageType<T> = keyof T;

export type MessagePayload<T, K extends keyof T> = T[K];

export interface BaseMessage {
  id: string;
  type: string;
  payload: any;
}