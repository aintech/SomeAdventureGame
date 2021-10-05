import React, { Component } from "react";
import { connect } from "react-redux";
import { BuildingType, toDisplay } from "../../../../models/Building";
import Quest from "../../../../models/Quest";
import { MAX_EMBARKED_QUESTS } from "../../../../utils/Variables";
import Loader from "../../../loader/Loader";
import "./stables-display.scss";

type StablesDisplayProps = {
  embarked: Quest[];
  closeDisplay: () => void;
};

const StablesDisplay = ({ embarked, closeDisplay }: StablesDisplayProps) => {
  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "stables-display") {
      closeDisplay();
    }
  };

  return (
    <div className="stables-display" id="stables-display" onClick={clickHandler}>
      <button className="stables-display__btn--close" onClick={closeDisplay}></button>
      <div className="stables-display__container">
        <div className="stables-display__name">{toDisplay(BuildingType.STABLES)}</div>
        <div className="stables-display__stats">
          <div>
            Выполняемые квесты {embarked.length}/{MAX_EMBARKED_QUESTS}
          </div>
          <li>
            {embarked.map((q) => (
              <ul key={q.id}>- {q.title}</ul>
            ))}
          </li>
        </div>
      </div>
    </div>
  );
};

type StablesDisplayContainerProps = {
  quests: Quest[];
  closeDisplay: () => void;
};

class StablesDisplayContainer extends Component<StablesDisplayContainerProps> {
  render() {
    const { quests, closeDisplay } = this.props;

    if (!quests) {
      return <Loader message={`Wating for heroes`} />;
    }

    const embarkedQuests = quests.filter((q) => q.progress !== undefined);

    return <StablesDisplay embarked={embarkedQuests} closeDisplay={closeDisplay} />;
  }
}

type StablesDisplayContainerState = {
  quests: Quest[];
};

const mapStateToProps = ({ quests }: StablesDisplayContainerState) => {
  return { quests };
};

export default connect(mapStateToProps)(StablesDisplayContainer);
