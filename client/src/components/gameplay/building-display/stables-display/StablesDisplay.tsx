import React, { Component } from "react";
import { connect } from "react-redux";
import Quest from "../../../../models/Quest";
import { MAX_EMBARKED_QUESTS } from "../../../../utils/Variables";
import Loader from "../../../loader/Loader";
import "./stables-display.scss";

type StablesDisplayProps = {
  embarked: Quest[];
};

const StablesDisplay = ({ embarked }: StablesDisplayProps) => {
  return (
    <div className="stables-display">
      <div className="stables-display__title">
        Свободных экипажей{" "}
        <span className="stables-display__count">
          {MAX_EMBARKED_QUESTS - embarked.length}/{MAX_EMBARKED_QUESTS}
        </span>
      </div>
      <li>
        {embarked.map((q, idx) => (
          <ul key={q.id}>
            {idx + 1} - на задании '{q.title}'
          </ul>
        ))}
      </li>
    </div>
  );
};

type StablesDisplayContainerProps = {
  quests: Quest[];
};

class StablesDisplayContainer extends Component<StablesDisplayContainerProps> {
  render() {
    const { quests } = this.props;

    if (!quests) {
      return <Loader message={`Wating for heroes`} />;
    }

    const embarkedQuests = quests.filter((q) => q.progress !== undefined);

    return <StablesDisplay embarked={embarkedQuests} />;
  }
}

type StablesDisplayContainerState = {
  quests: Quest[];
};

const mapStateToProps = ({ quests }: StablesDisplayContainerState) => {
  return { quests };
};

export default connect(mapStateToProps)(StablesDisplayContainer);
