import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { closeQuestProcess, heroStatsChoosed } from "../../../actions/Actions";
import Hero from "../../../models/hero/Hero";
import Quest from "../../../models/Quest";
import Loader from "../../loader/Loader";
import HeroItem from "../village-building-display/guild-display/heroes/hero-item/HeroItem";
import QuestMap from "./quest-map/QuestMap";
import "./quest-process-display.scss";

export type QuestProcess = {
  quest: Quest;
  heroes: Hero[];
};

type QuestProcessDisplayProps = {
  quest: Quest;
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
  closeDisplay: () => void;
};

const QuestProcessDisplay = ({ quest, heroes, heroClicked, closeDisplay }: QuestProcessDisplayProps) => {
  const heroClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    heroClicked(hero);
  };

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "quest-process-display") {
      closeDisplay();
    }
  };

  return (
    <div className="quest-process-display" id="quest-process-display" onClick={clickHandler}>
      <button className="quest-process-display__btn--close" onClick={closeDisplay}></button>
      <div className="quest-process-display__container">
        <div className="quest-process-display__name">{quest.title}</div>
        <QuestMap quest={quest} />
        <div className="quest-process-display__heroes-holder">
          {heroes.map((hero) => (
            <HeroItem
              key={hero.id}
              hero={hero}
              enabled={true}
              itemClickHandler={(event) => heroClickHandler(hero, event)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

type QuestProcessDisplayContainerProps = {
  activeQuestProcess: QuestProcess;
  heroClicked: (hero: Hero) => void;
  closeQuestProcess: () => void;
};

class QuestProcessDisplayContainer extends Component<QuestProcessDisplayContainerProps> {
  render() {
    const { heroClicked, closeQuestProcess } = this.props;

    if (!this.props.activeQuestProcess) {
      return null;
    }

    const { quest, heroes } = this.props.activeQuestProcess;

    if (!quest) {
      return <Loader message={`Wating for quest`} />;
    }

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    return (
      <QuestProcessDisplay quest={quest} heroes={heroes} closeDisplay={closeQuestProcess} heroClicked={heroClicked} />
    );
  }
}

type QuestProcessDisplayContainerState = {
  activeQuestProcess: QuestProcess;
};

const mapStateToProps = ({ activeQuestProcess }: QuestProcessDisplayContainerState) => {
  return { activeQuestProcess };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      heroClicked: heroStatsChoosed,
      closeQuestProcess,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestProcessDisplayContainer);
