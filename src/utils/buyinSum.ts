import type { Event } from '../types/poker'

export const sumBuyin = (events: Event[]) =>
  events.reduce<Record<string, number>>((acc, e) => {
    acc[e.playerId] = (acc[e.playerId] || 0) + e.amount
    return acc
  }, {})