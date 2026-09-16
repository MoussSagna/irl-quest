import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { mockData } from '../shared/mockData';
import type { Player } from '../shared/types';
import type { Quest, QuestStatus } from '../../design-system/components/QuestCard';

type QuestContextValue = {
  quests: Quest[];
  player: Player;
  completeQuest: (id: string) => void;
};

const QuestContext = createContext<QuestContextValue | null>(null);

export function QuestProvider({ children }: PropsWithChildren) {
  const [quests, setQuests] = useState(mockData.quests);
  const [player, setPlayer] = useState(mockData.player);

  const value = useMemo(() => ({
    quests,
    player,
    completeQuest: (id: string) => {
      setQuests((current) => current.map((quest) => quest.id === id ? { ...quest, status: 'completed' as QuestStatus, progress: 1 } : quest));
      setPlayer((current) => ({ ...current, currentXp: Math.min(current.nextLevelXp, current.currentXp + (quests.find((quest) => quest.id === id)?.xp ?? 0)), totalQuestsCompleted: current.totalQuestsCompleted + 1 }));
    },
  }), [player, quests]);

  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>;
}

export function useQuestStore() {
  const context = useContext(QuestContext);
  if (!context) throw new Error('useQuestStore must be used within QuestProvider');
  return context;
}
