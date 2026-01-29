import { useGame } from '../context/GameContext';
import { useMemo, useState } from 'react';
import BuyButton from './BuyButton';
import clsx from 'clsx';

interface Props {
  phase: 'play' | 'settle' | 'done';
  cash: Record<string, string>;
  setCash: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onEdit: () => void;
  defaultBuyIn: number;
}

export default function PlayerTable({ phase, cash, setCash, onEdit, defaultBuyIn }: Props) {
  const { players, events, dispatch } = useGame();
  const [name, setName] = useState('');

  const totalBuy = useMemo(() => {
    const obj: Record<string, number> = {};
    players.forEach(p => (obj[p.id] = 0));
    events.forEach(e => (obj[e.playerId] += e.amount));
    return obj;
  }, [players, events]);

  const inputsDisabled = phase === 'play';

  return (
    <div className="space-y-6">
      {/* add player */}
      <form
        className="flex gap-3"
        onSubmit={e => {
          e.preventDefault();
          if (phase !== 'play') return;
          if (name.trim()) dispatch({ type: 'addPlayer', name: name.trim() });
          setName('');
        }}
      >
        <input
          value={name}
          disabled={phase !== 'play'}
          onChange={e => setName(e.target.value)}
          placeholder="Player name"
          className="input-name flex-1"
        />
        <button
          className={clsx(
            'btn-neon px-6',
            phase !== 'play' && 'cursor-not-allowed opacity-40',
          )}
          type="submit"
        >
          Add
        </button>
      </form>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="table-fixed w-full whitespace-nowrap text-center text-sm sm:text-base">
          <colgroup>
            <col className="w-[28%] sm:w-[30%]" />
            <col className="w-[14%] sm:w-[15%]" />
            <col className="w-[26%] sm:w-[25%]" />
            <col className="w-[32%] sm:w-[30%]" />
          </colgroup>
          <thead>
            <tr className="table-head">
              <th className="px-2 py-2 sm:px-4">Player</th>
              <th className="px-1 py-2 sm:px-4">Buy-in</th>
              <th className="px-1 py-2 sm:px-4">Final Chip</th>
              <th className="px-1 py-2 sm:px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map(p => (
              <tr key={p.id} className="border-b border-white/10">
                <td className="py-2 px-2 sm:px-4 truncate max-w-0">{p.name}</td>
                <td className="py-2 px-1 sm:px-4">{totalBuy[p.id]}</td>
                <td className="py-2 px-1 sm:px-4">
                  <input
                    type="number"
                    value={cash[p.id]}
                    disabled={inputsDisabled}
                    onChange={e => {
                      setCash(prev => ({ ...prev, [p.id]: e.target.value }));
                      if (!inputsDisabled) onEdit();
                    }}
                    className={clsx(
                      'input-chip max-w-[110px] mx-auto',
                      !inputsDisabled && 'chip-animated',
                      inputsDisabled && 'bg-gray-800 opacity-60',
                    )}
                  />
                </td>
                <td className="py-2 px-1 sm:px-4">
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <BuyButton playerId={p.id} disabled={phase !== 'play'} defaultAmount={defaultBuyIn} />
                    <button
                      disabled={phase !== 'play'}
                      onClick={() =>
                        phase === 'play' &&
                        dispatch({ type: 'removePlayer', id: p.id })
                      }
                      className={clsx(
                        'min-w-[32px] min-h-[32px] inline-flex items-center justify-center rounded text-xs text-neonPink hover:bg-white/10 transition-colors',
                        phase !== 'play' && 'cursor-not-allowed opacity-40',
                      )}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}