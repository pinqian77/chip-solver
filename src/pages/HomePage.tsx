import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calculator, ArrowLeft } from 'lucide-react';
import PlayerTable from '../components/PlayerTable';
import EventLog from '../components/EventLog';
import { useGame } from '../context/GameContext';
import { settle } from '../algorithms/settle';
import NeonButton from '../components/NeonButton';

export default function HomePage() {
  /* -------- state -------- */
  const [phase, setPhase] = useState<'play' | 'settle' | 'done'>('play');
  const { players, events } = useGame();
  const [cash, setCash] = useState<Record<string, string>>(
    () => Object.fromEntries(players.map(p => [p.id, ''])),
  );
  /* -------- sync cash keys with players -------- */
  useEffect(() => {
    setCash(prev => {
      const next: Record<string, string> = {};
      players.forEach(p => {
        next[p.id] = prev[p.id] ?? '';
      });
      return next;
    });
  }, [players]);

  const [validateOK, setValidateOK] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof settle> | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* -------- center height sync -------- */
  const [centerHeight, setCenterHeight] = useState<number>(0);
  const tableRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (tableRef.current) setCenterHeight(tableRef.current.offsetHeight);
  }, [players, events, phase, validateOK, result, error]);

  /* -------- derived totals -------- */
  const totalBuy = events.reduce((s, e) => s + e.amount, 0);
  const totalCash = players.reduce((s, p) => s + (Number(cash[p.id]) || 0), 0);

  /* -------- handlers -------- */
  const goSettle = () => setPhase('settle');

  const backToPlay = () => {
    setCash(Object.fromEntries(players.map(p => [p.id, ''])));

    setValidateOK(false);
    setResult(null);
    setError(null);
    setPhase('play');
  };

  const resetValidation = () => {
    setValidateOK(false);
    setError(null);
    setPhase('settle');
  };

  const validate = () => {
    if (totalBuy !== totalCash) {
      setError(
        `Total buy-in ${totalBuy} ≠ chips ${totalCash} (diff ${
          totalBuy - totalCash
        })`,
      );
      setValidateOK(false);
    } else {
      setError(null);
      setValidateOK(true);
    }
  };

  const calc = () => {
    const res = settle(
      players,
      events,
      players.map(p => ({ playerId: p.id, value: Number(cash[p.id]) || 0 })),
    );
    setResult(res);
    setPhase('done');
  };

  /* -------- layout -------- */
  return (
    <div className="flex flex-col items-center gap-10 px-4 py-8 md:px-6 lg:px-8">
<h1 className="font-orbitron text-4xl text-neonMagenta drop-shadow-neonPink text-center">
  🃏 Chip Solver
</h1>

      <motion.div
        layout
        className="grid gap-6"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
          maxWidth: '1280px',
        }}
      >
        {/* Log */}
        <motion.section
          layout
          className="card p-6 max-h-[70vh] overflow-hidden order-1"
          style={{ maxHeight: centerHeight || 'auto' }}
        >
          <EventLog phase={phase === 'play' ? 'play' : 'settle'} />
        </motion.section>

        {/* PlayerTable */}
        <motion.section
          layout
          ref={tableRef}
          className="card p-6 flex flex-col gap-6 order-2"
          style={{ gridColumn: 'span 2' }}
        >
          <PlayerTable
            phase={phase}
            cash={cash}
            setCash={setCash}
            onEdit={resetValidation}
          />

          {/*  buttons row  */}
<div className="flex justify-between">
  {/* Back at left */}
  {phase !== 'play' && (
    <NeonButton
      label="Back"
      onClick={backToPlay}
      icon={<ArrowLeft size={16} />}
    />
  )}

  {/* right group */}
  <div className="flex gap-4">
    {phase === 'play' && (
      <NeonButton label="Settle" onClick={goSettle} />
    )}
    {(phase === 'settle' || phase === 'done') && (
      <>
        <NeonButton
          label="Validate"
          onClick={validate}
          icon={<Check size={16} />}
        />
        {validateOK && (
          <NeonButton
            label="Calculate"
            onClick={calc}
            icon={<Calculator size={18} />}
          />
        )}
      </>
    )}
  </div>
</div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </motion.section>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.aside
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="card p-8 max-h-[70vh] overflow-y-auto order-3"
              style={{ maxHeight: centerHeight || 'auto' }}
            >
              <h2 className="font-orbitron text-lg text-neonPink">Net</h2>
              <ul className="text-sm leading-6">
                {players.map(p => (
                  <li key={p.id}>
                    {p.name}: {result.net[p.id] > 0 ? '+' : ''}
                    {result.net[p.id]}
                  </li>
                ))}
              </ul>

              <h2 className="mt-6 font-orbitron text-lg text-neonPink">Transfers</h2>
              {result.list.length === 0 ? (
                <p className="text-sm">No transfer needed</p>
              ) : (
                <ul className="text-sm leading-6">
                  {result.list.map(t => (
                    <li key={t.from + t.to}>
                      {players.find(p => p.id === t.from)!.name} →{' '}
                      {players.find(p => p.id === t.to)!.name}{' '}
                      <strong>{t.amount}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}