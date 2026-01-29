import { useGame } from '../context/GameContext';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function EventLog({ phase }: { phase: 'play' | 'settle' | 'done' }) {
  const { events, players, dispatch } = useGame();
  const list = [...events].sort((a, b) => b.createdAt - a.createdAt);
  const nameOf = (id: string) => players.find(p => p.id === id)?.name ?? '???';

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-orbitron text-neonPink">Log</h2>
      {list.length === 0 ? (
        <p className="text-sm text-gray-400 flex-none mt-2">(empty)</p>
      ) : (
        <ul className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1 text-sm">
          {list.map(e => (
            <li
              key={e.id}
              className="flex items-center justify-between break-all"
            >
              <span>
                {new Date(e.createdAt).toLocaleTimeString([], {
                  hour12: false,
                })}{' '}
                — {nameOf(e.playerId)} buy&nbsp;<strong>{e.amount}</strong>
              </span>
              <button
                aria-label="Undo event"
                disabled={phase !== 'play'}
                onClick={() => {
                  if (phase !== 'play') return;
                  if (window.confirm('Undo?'))
                    dispatch({ type: 'removeEvent', eventId: e.id });
                }}
                className={clsx(
                  'rounded border p-1',
                  phase === 'play'
                    ? 'hover:bg-neonPink/10'
                    : 'cursor-not-allowed opacity-40',
                )}
              >
                <Trash2 size={14} className="text-neonPink" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}