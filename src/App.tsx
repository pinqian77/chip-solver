import { GameProvider } from './context/GameContext'
import HomePage from './pages/HomePage'


export default function App() {
  return (
    <GameProvider>
      {/* 新增 flex 容器：把整个页面内容水平居中 */}
      <div className="min-h-screen flex justify-center">
        <HomePage />
      </div>
    </GameProvider>
  )
}