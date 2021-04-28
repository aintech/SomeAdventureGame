import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import {
  buildingClicked,
  fetchHeroes,
  fetchQuests,
} from "../../actions/actions";
import BuildingDetails from "../../components/building-details/building-details";
import BuildingItem from "../../components/building-item/building-item";
import Loader from "../../components/loader/loader";
import QuestProgressListContainer from "../../components/quest-progress/quest-progress-list/quest-progress-list.js";
import QuestRewardContainer from "../../components/quest-reward/quest-reward.js";
import AuthContext from "../../contexts/auth-context";
import withApiService from "../../hoc/with-api-service.js";
import "./gameplay-page.scss";

const GameplayPage = ({
  quests,
  heroes,
  onBuildingClicked,
  chosenBuilding,
}) => {
  const [buildings] = useState([
    { id: 1, type: "tavern" },
    { id: 2, type: "guild" },
  ]);

  return (
    <div className="gameplay">
      <div className="gameplay__world">
        {buildings.map((building) => (
          <div key={building.id}>
            <BuildingItem
              building={building}
              onBuildingClicked={() => onBuildingClicked(building)}
            />
          </div>
        ))}

        <BuildingDetails chosenBuilding={chosenBuilding} />
      </div>
      <div>
        <QuestRewardContainer />
      </div>
      <div className="gameplay__quest-progress">
        <QuestProgressListContainer quests={quests} heroes={heroes} />
      </div>
    </div>
  );
};

class GameplayPageContainer extends Component {
  static contextType = AuthContext;

  componentDidMount() {
    const auth = this.context;
    this.props.fetchQuests(auth);
    this.props.fetchHeroes(auth);
  }

  render() {
    const { quests, heroes, onBuildingClicked, chosenBuilding } = this.props;

    if (!quests) {
      return <Loader message={"Fetching quests..."} />;
    }

    if (!heroes) {
      return <Loader message={"Fetching heroes..."} />;
    }

    return (
      <GameplayPage
        quests={quests}
        heroes={heroes}
        onBuildingClicked={onBuildingClicked}
        chosenBuilding={chosenBuilding}
      />
    );
  }
}

const mapStateToProps = ({ quests, heroes, chosenBuilding }) => {
  return { quests, heroes, chosenBuilding };
};

const mapDispatchToProps = (dispatch, customProps) => {
  const { apiService } = customProps;
  return bindActionCreators(
    {
      onBuildingClicked: buildingClicked,
      fetchQuests: fetchQuests(apiService),
      fetchHeroes: fetchHeroes(apiService),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(GameplayPageContainer);
