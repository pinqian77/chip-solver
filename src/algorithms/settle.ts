import type { Player, Event, CashoutInput } from '../types/poker';

export function settle(
  players: Player[],
  buyinEvents: Event[],
  cashouts: CashoutInput[],
) {
  const B: Record<string, number> = {};
  const C: Record<string, number> = {};
  players.forEach(p => {
    B[p.id] = 0;
    C[p.id] = 0;
  });
  buyinEvents.forEach(e => (B[e.playerId] += e.amount));
  cashouts.forEach(c => (C[c.playerId] = c.value));

  const net: Record<string, number> = {};
  players.forEach(p => (net[p.id] = C[p.id] - B[p.id]));

  const sum = Object.values(net).reduce((a, b) => a + b, 0);
  if (sum !== 0) throw new Error('Buy-in does not match cashout total.');

  const winners = players
    .filter(p => net[p.id] > 0)
    .map(p => ({ id: p.id, remain: net[p.id] }))
    .sort((a, b) => b.remain - a.remain);

  const losers = players
    .filter(p => net[p.id] < 0)
    .map(p => ({ id: p.id, need: -net[p.id] }))
    .sort((a, b) => b.need - a.need);

  const matrix: Record<string, Record<string, number>> = {};
  players.forEach(a => {
    matrix[a.id] = {};
    players.forEach(b => (matrix[a.id][b.id] = 0));
  });

  for (const l of losers) {
    let need = l.need;
    while (need > 0 && winners.length) {
      const w = winners[0];
      const pay = Math.min(need, w.remain);
      matrix[l.id][w.id] = pay;
      need -= pay;
      w.remain -= pay;
      if (w.remain === 0) winners.shift();
    }
  }

  const list = players.flatMap(f =>
    players
      .filter(t => matrix[f.id][t.id] > 0)
      .map(t => ({ from: f.id, to: t.id, amount: matrix[f.id][t.id] })),
  );

  return { net, matrix, list };
}