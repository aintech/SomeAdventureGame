import React from 'react';
import HealIconImg from '../../../../img/quest-perform/battle-process/heal-icon.png';
import Hero, { calcHealthFraction } from '../../../../models/hero/Hero';
import { HeroType } from '../../../../models/hero/HeroType';
import './quest-hero-item.scss';

// TODO: визуально дизейблить героев без здоровья
// TODO: золото распределяется по героям после завершения задания

type QuestHeroItemProps = {
  hero: Hero;
  itemClickHandler?: (event: React.MouseEvent<HTMLDivElement>) => void;
  reward?: { gold: number; experience: number };
  hitted?: boolean;
  healed?: boolean;
};

const QuestHeroItem = ({ hero, itemClickHandler, hitted, healed, reward }: QuestHeroItemProps) => {
  const style = {
    opacity: hero.health > 0 ? 1 : 0.5,
  };

  const rewardStyle = {
    display: reward ? 'block' : 'none',
  };

  // Приходится делать две анимации, т.к. когда надо проиграть анимацию
  // которая уже была последней код не понимает что её надо переигрывать
  // из-за этого приходится делать вторую идентичную анимацию чтобы переключится на неё
  const classes = `
      quest-hero-item
      ${reward ? '' : ' hero-item--hoverable'}
      ${hitted === undefined ? '' : hitted ? ' hero-item--hitted' : ' hero-item--hitted2'} 
      ${hero.health <= 0 ? 'defeated' : ''}`;

  const healIconClass = `
      heal-icon
      ${healed === undefined ? '' : healed ? ' heal-icon_playing' : ' heal-icon_playing2'}`;

  return (
    <div className={classes} style={style} onClick={itemClickHandler}>
      <div className="quest-hero-item__name">{hero.name}</div>
      <div className={`quest-hero-item__portrait--${HeroType[hero.type].toLowerCase()}`}></div>

      <div className="quest-hero-item__bars">
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
      <img src={HealIconImg} alt="heal" className={healIconClass}></img>
    </div>
  );
};

export default QuestHeroItem;
