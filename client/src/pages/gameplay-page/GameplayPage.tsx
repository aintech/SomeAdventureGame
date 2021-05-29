import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { buildingClicked } from "../../actions/Actions";
import {
  fetchHeroes,
  fetchQuests,
  fetchTavernPatrons,
} from "../../actions/ApiActions";
import BuildingDetails from "../../components/gameplay/building-details/BuildingDetails";
import BuildingItem from "../../components/gameplay/building-item/BuildingItem";
import HeroStats from "../../components/gameplay/hero-stats/HeroStats";
import Loader from "../../components/loader/Loader";
import QuestProgressListContainer from "../../components/gameplay/quest-progress/quest-progress-list/QuestProgressList";
import QuestRewardContainer from "../../components/gameplay/quest-reward/QuestReward";
import AuthContext, { AuthProps } from "../../contexts/AuthContext";
import withApiService, { WithApiServiceProps } from "../../hoc/WithApiService";
import Building, { BuildingType } from "../../models/Building";
import Hero from "../../models/Hero";
import Quest from "../../models/Quest";
import "./gameplay-page.scss";

type GameplayPageProps = {
  quests: Quest[];
  heroes: Hero[];
  onBuildingClicked: (building: Building) => void;
  chosenBuilding: Building;
};

const GameplayPage = ({
  quests,
  heroes,
  onBuildingClicked,
  chosenBuilding,
}: GameplayPageProps) => {
  const [buildings] = useState([
    new Building(1, BuildingType.TAVERN),
    new Building(2, BuildingType.GUILD),
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
      <QuestRewardContainer />
      <HeroStats />
      <div className="gameplay__quest-progress">
        <QuestProgressListContainer quests={quests} heroes={heroes} />
      </div>
    </div>
  );
};

type GameplayPageContainerProps = {
  fetchQuests: (auth: AuthProps) => Quest[];
  fetchHeroes: (auth: AuthProps) => Hero[];
  fetchTavernPatrons: (auth: AuthProps) => Hero[];
  quests: Quest[];
  heroes: Hero[];
  onBuildingClicked: (building: Building) => void;
  chosenBuilding: Building;
};

class GameplayPageContainer extends Component<GameplayPageContainerProps> {
  static contextType = AuthContext;

  componentDidMount() {
    const auth = this.context;
    this.props.fetchQuests(auth);
    this.props.fetchHeroes(auth);
    this.props.fetchTavernPatrons(auth);
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

type state = {
  quests: Quest[];
  heroes: Hero[];
  chosenBuilding: Building;
};

const mapStateToProps = ({ quests, heroes, chosenBuilding }: state) => {
  return { quests, heroes, chosenBuilding };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  customProps: WithApiServiceProps
) => {
  const { apiService } = customProps;
  return bindActionCreators(
    {
      onBuildingClicked: buildingClicked,
      fetchQuests: fetchQuests(apiService),
      fetchHeroes: fetchHeroes(apiService),
      fetchTavernPatrons: fetchTavernPatrons(apiService),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(GameplayPageContainer);
