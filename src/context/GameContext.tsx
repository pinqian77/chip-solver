import React, { createContext, useContext, useReducer } from 'react';
import type { Player, Event } from '../types/poker';
import { nanoid } from 'nanoid';

interface State {
  players: Player[];
  events: Event[];
}

type Action =
  | { type: 'addPlayer'; name: string }
  | { type: 'removePlayer'; id: string }
  | { type: 'buyin'; playerId: string; amount: number }
  | { type: 'removeEvent'; eventId: string };

const GameContext = createContext<
  (State & { dispatch: React.Dispatch<Action> }) | undefined
>(undefined);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'addPlayer':
      return {
        ...state,
        players: [...state.players, { id: nanoid(), name: action.name }],
      };
    case 'removePlayer':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.id),
        events: state.events.filter(e => e.playerId !== action.id),
      };
    case 'buyin':
      return {
        ...state,
        events: [
          ...state.events,
          {
            id: nanoid(),
            playerId: action.playerId,
            amount: action.amount,
            type: 'buyin',
            createdAt: Date.now(),
          },
        ],
      };
    case 'removeEvent':
      return {
        ...state,
        events: state.events.filter(e => e.id !== action.eventId),
      };
    default:
      return state;
  }
}

export const GameProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, { players: [], events: [] });
  return (
    <GameContext.Provider value={{ ...state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}