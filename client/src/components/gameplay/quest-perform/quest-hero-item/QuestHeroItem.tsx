import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { heroStatsChoosed } from '../../../../actions/Actions';
import HealIconImg from '../../../../img/quest-perform/battle-process/heal-icon.png';
import Hero, { calcHealthFraction } from '../../../../models/hero/Hero';
import { HeroType } from '../../../../models/hero/HeroType';
import { StatusEffectType } from '../battle-process/process-helpers/CheckpointActor';
import QuestHero from '../battle-process/process-helpers/QuestHero';
import './quest-hero-item.scss';

type QuestHeroItemProps = {
  hero: QuestHero;
  heroClickHandler: (hero: Hero) => void;
  current?: boolean;
  reward?: { heroId: number; gold: number; experience: number };
  // не используется, но нужен чтобы заставить айтем ререндериться.
  seed: number;
};

const QuestHeroItem = ({ hero, current, heroClickHandler, reward, seed }: QuestHeroItemProps) => {
  const style = {
    opacity: hero.health > 0 ? 1 : 0.5,
  };

  const rewardStyle = {
    display: reward ? 'block' : 'none',
  };

  const mainClass = `quest-hero-item${current ? ' quest-hero-item__current' : ''}${hero.health <= 0 ? ' quest-hero-item__defeated' : ''}`;

  const displayClass = `quest-hero-item__display_${HeroType[hero.type].toLowerCase()}${
    hero.hitted === undefined ? '' : hero.hitted === false ? ' quest-hero-item__display_hitted-alt' : ' quest-hero-item__display_hitted'
  }`;

  const healIconClass = `heal-icon${hero.healed ? ' heal-icon_playing' : ''}`;

  return (
    <div className={mainClass} style={style} onClick={() => heroClickHandler(hero)}>
      <div className="quest-hero-item__name">{hero.name}</div>
      <div className="quest-hero-item__status-holder">
        {hero.statusEffects.map((eff) => (
          <div key={eff.id} className={`quest-hero-item__status quest-hero-item__status_${StatusEffectType[eff.type].toLowerCase()}`}></div>
        ))}
      </div>

      <div className={displayClass}></div>

      <div className="quest-hero-item__bars">
        <div className={`quest-hero-item__bar-holder${reward ? '' : ' quest-hero-item__bar_hidden'}`}>
          <div className="quest-hero-item__bar quest-hero-item__bar_exp" style={{ width: `${hero.level.progress * 100}%` }}>
            <div className="quest-hero-item__bar_overlay"></div>
          </div>
        </div>
        <div className="quest-hero-item__bar-holder">
          <div className="quest-hero-item__bar quest-hero-item__bar_health" style={{ width: `${calcHealthFraction(hero) * 100}%` }}>
            <div className="quest-hero-item__bar_overlay"></div>
          </div>
        </div>
        <div className="quest-hero-item__bar-holder">
          <div className="quest-hero-item__bar quest-hero-item__bar_psy" style={{ width: `100%` }}>
            <div className="quest-hero-item__bar_overlay"></div>
          </div>
        </div>
      </div>
      <div className="quest-hero-item__reward--experience" style={rewardStyle}>
        {reward?.experience}
      </div>
      <div className="quest-hero-item__reward--gold" style={rewardStyle}>
        {reward?.gold}
      </div>
      <img src={HealIconImg} alt="heal" className={healIconClass}></img>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      heroClickHandler: heroStatsChoosed,
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(QuestHeroItem);
