import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { fetchInitials } from "../../actions/ApiActions";
import BuildingContainer from "../../components/gameplay/building-container/BuildingContainer";
import GameWorld from "../../components/gameplay/game-world/GameWorld";
import HeroStats from "../../components/gameplay/hero-stats/HeroStats";
import QuestProgressList from "../../components/gameplay/quest-progress/quest-progress-list/QuestProgressList";
import QuestRewardContainer from "../../components/gameplay/quest-reward/QuestReward";
import Loader from "../../components/loader/Loader";
import AuthContext, { AuthProps } from "../../contexts/AuthContext";
import withApiService, { WithApiServiceProps } from "../../hoc/WithApiService";
import Hero from "../../models/Hero";
import Quest from "../../models/Quest";
import "./gameplay-page.scss";

const GameplayPage = () => {
  return (
    <React.Fragment>
      <GameWorld />
      <BuildingContainer />
      <QuestRewardContainer />
      <HeroStats />
      <QuestProgressList />
    </React.Fragment>
  );
};

type GameplayPageContainerProps = {
  // fetchQuests: (auth: AuthProps) => Quest[];
  // fetchHeroes: (auth: AuthProps) => Hero[];
  // fetchTavernPatrons: (auth: AuthProps) => Hero[];
  fetchInitials: (auth: AuthProps) => void;
  quests: Quest[];
  heroes: Hero[];
};

class GameplayPageContainer extends Component<GameplayPageContainerProps> {
  static contextType = AuthContext;

  componentDidMount() {
    const auth = this.context;
    this.props.fetchInitials(auth);
    // this.props.fetchQuests(auth);
    // this.props.fetchHeroes(auth);
    // this.props.fetchTavernPatrons(auth);
  }

  render() {
    if (!this.props.quests) {
      return <Loader message={"Fetching quests..."} />;
    }

    if (!this.props.heroes) {
      return <Loader message={"Fetching heroes..."} />;
    }

    return <GameplayPage />;
  }
}

type GameplayPageState = {
  quests: Quest[];
  heroes: Hero[];
};

const mapStateToProps = ({ quests, heroes }: GameplayPageState) => {
  return { quests, heroes };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  customProps: WithApiServiceProps
) => {
  const { apiService } = customProps;
  return bindActionCreators(
    {
      fetchInitials: fetchInitials(apiService),
      // fetchQuests: fetchQuests(apiService),
      // fetchHeroes: fetchHeroes(apiService),
      // fetchTavernPatrons: fetchTavernPatrons(apiService),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(GameplayPageContainer);
