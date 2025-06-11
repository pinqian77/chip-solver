export type EventType = 'buyin';

export interface Player {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  playerId: string;
  amount: number;
  type: EventType;
  createdAt: number;
}

export interface CashoutInput {
  playerId: string;
  value: number;
}