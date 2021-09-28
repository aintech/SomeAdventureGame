import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { fetchInitials } from "../../actions/ApiActions";
import ConfirmDialog from "../../components/confirm-dialog/ConfirmDialog";
import GameplayTooltip from "../../components/gameplay-tooltip/GameplayTooltip";
import GameTimer from "../../components/gameplay/game-timer/GameTimer";
import GameWorld from "../../components/gameplay/game-world/GameWorld";
import HeroStatsDisplay from "../../components/gameplay/hero-stats-display/HeroStatsDisplay";
import QuestPerform from "../../components/gameplay/quest-perform/QuestPerform";
import QuestProgressList from "../../components/gameplay/quest-travel/quest-travel-list/QuestTravelList";
import QuestRewardContainer from "../../components/gameplay/quest-reward/QuestReward";
import BuildingDisplay from "../../components/gameplay/village-building-display/building-details/BuildingDetails";
import Loader from "../../components/loader/Loader";
import withApiService, { WithApiServiceProps } from "../../hoc/WithApiService";
import Hero from "../../models/hero/Hero";
import Quest from "../../models/Quest";
import "./gameplay-page.scss";

const GameplayPage = () => {
  return (
    <>
      <GameplayTooltip />
      <GameWorld />
      <GameTimer />
      <BuildingDisplay />
      <QuestRewardContainer />
      <HeroStatsDisplay />
      <QuestProgressList />
      <QuestPerform />
      <ConfirmDialog />
    </>
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

const mapDispatchToProps = (dispatch: Dispatch, customProps: WithApiServiceProps) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      fetchInitials: fetchInitials(apiService, auth),
    },
    dispatch
  );
};

export default compose(withApiService(), connect(mapStateToProps, mapDispatchToProps))(GameplayPageContainer);
