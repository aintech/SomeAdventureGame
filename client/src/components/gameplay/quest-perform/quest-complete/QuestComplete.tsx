import Hero from '../../../../models/hero/Hero';
import Quest from '../../../../models/Quest';
import goldIconImg from '../../../../img/quest-perform/quest-complete/quest-complete__gold.png';
import fameIconImg from '../../../../img/quest-perform/quest-complete/quest-complete__star.png';
import { GUILD_SHARE } from '../../../../utils/Variables';
import './quest-complete.scss';
import { useEffect } from 'react';

type QuestCompleteProps = {
  quest: Quest;
  heroes: Hero[];
  setHeroRewards: (rewards: Map<number, { gold: number; experience: number }>) => void;
  completeQuest: () => void;
};

/**
 * TODO: реплика героев после выполнения квеста (в качестве небольшого суммари по квесту)
 */

const QuestComplete = ({ quest, heroes, setHeroRewards, completeQuest }: QuestCompleteProps) => {
  useEffect(() => {
    const heroGoldReward = Math.floor(Math.ceil(quest.tribute * (1 - GUILD_SHARE)) / heroes.length);
    const heroExperienceReward = Math.ceil(quest.experience / heroes.length);

    const rewards: Map<number, { gold: number; experience: number }> = new Map();
    heroes.forEach((h) => {
      rewards.set(h.id, { gold: heroGoldReward, experience: heroExperienceReward });
    });

    setHeroRewards(rewards);
  }, [quest, heroes, setHeroRewards]);

  return (
    <div className="quest-complete">
      <div className="quest-complete__tribute">
        <img src={goldIconImg} alt="gold" />
        <span className="quest-complete__tribute--text">{Math.floor(quest.tribute * GUILD_SHARE)} gold</span>
      </div>
      <div className="quest-complete__fame">
        <img src={fameIconImg} alt="fame" />
        <span className="quest-complete__fame--text">{quest.fame} fame</span>
      </div>
      <button onClick={completeQuest} className="quest-complete__btn_accept">
        Завершить квест
      </button>
    </div>
  );
};

export default QuestComplete;
