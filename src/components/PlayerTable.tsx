import { useGame } from '../context/GameContext';
import { useMemo, useState } from 'react';
import BuyButton from './BuyButton';
import clsx from 'clsx';

interface Props {
  phase: 'play' | 'settle' | 'done';
  cash: Record<string, string>;
  setCash: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onEdit: () => void;
}

export default function PlayerTable({ phase, cash, setCash, onEdit }: Props) {
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
        <table className="table-fixed w-full min-w-[520px] whitespace-nowrap text-center">
          <colgroup>
            <col style={{ width: '30%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <thead>
            <tr className="table-head">
              <th className="px-4 py-2">Player</th>
              <th className="px-4 py-2">Buy-in</th>
              <th className="px-4 py-2">Final Chip</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map(p => (
              <tr key={p.id} className="border-b border-white/10">
                <td className="py-2 px-4">{p.name}</td>
                <td className="py-2 px-4">{totalBuy[p.id]}</td>
                <td className="py-2 px-4">
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
                <td className="py-2 px-4 flex items-center justify-center gap-2">
                  <BuyButton playerId={p.id} disabled={phase !== 'play'} />
                  <button
                    disabled={phase !== 'play'}
                    onClick={() =>
                      phase === 'play' &&
                      dispatch({ type: 'removePlayer', id: p.id })
                    }
                    className={clsx(
                      'text-xs text-neonPink hover:underline',
                      phase !== 'play' && 'cursor-not-allowed opacity-40',
                    )}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}