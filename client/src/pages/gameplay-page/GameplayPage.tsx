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
import withApiService, { WithApiServiceProps } from "../../hoc/WithApiService";
import Hero from "../../models/hero/Hero";
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
  fetchInitials: () => void;
  quests: Quest[];
  heroes: Hero[];
};

class GameplayPageContainer extends Component<GameplayPageContainerProps> {
  componentDidMount() {
    this.props.fetchInitials();
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
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      fetchInitials: fetchInitials(apiService, auth),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(GameplayPageContainer);
