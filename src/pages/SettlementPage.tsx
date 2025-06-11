import { useGame } from '../context/GameContext'
import { useState } from 'react'
import { settle } from '../algorithms/settle'

export default function SettlementPage() {
  const { players, events } = useGame()
  // 建立一个本地状态保存输入值
  const [cash, setCash] = useState<Record<string, string>>(() =>
    Object.fromEntries(players.map(p => [p.id, ''])),
  )
  const [result, setResult] = useState<ReturnType<typeof settle> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalc = () => {
    try {
      const cashouts = players.map(p => ({
        playerId: p.id,
        value: Number(cash[p.id]) || 0,
      }))
      const res = settle(players, events, cashouts)
      setResult(res)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
      setResult(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">结算</h1>

      {/* 输入表 */}
      <table className="w-full text-sm">
        <thead className="border-b text-left font-semibold">
          <tr>
            <th className="py-1">玩家</th>
            <th className="py-1">最终筹码价值</th>
          </tr>
        </thead>
        <tbody>
          {players.map(p => (
            <tr key={p.id} className="border-b">
              <td className="py-1">{p.name}</td>
              <td className="py-1">
                <input
                  type="number"
                  value={cash[p.id]}
                  onChange={e =>
                    setCash(prev => ({ ...prev, [p.id]: e.target.value }))
                  }
                  placeholder="输入整数"
                  className="w-32 rounded border p-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="rounded bg-emerald-600 px-4 py-2 text-white"
        onClick={handleCalc}
      >
        计算
      </button>

      {/* 结果 / 错误 */}
      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">净盈亏</h2>
          <ul>
            {players.map(p => (
              <li key={p.id}>
                {p.name}:{' '}
                {result.net[p.id] > 0 ? '+' : ''}
                {result.net[p.id]}
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-semibold">最简转账</h2>
          {result.list.length === 0 ? (
            <p>已平局，无需转账</p>
          ) : (
            <ul>
              {result.list.map(t => {
                const from = players.find(p => p.id === t.from)!.name
                const to = players.find(p => p.id === t.to)!.name
                return (
                  <li key={from + to}>
                    {from} → {to} <strong>{t.amount}</strong>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}