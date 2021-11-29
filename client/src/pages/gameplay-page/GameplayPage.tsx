import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { fetchInitials } from "../../actions/ApiActions";
import ConfirmDialog from "../../components/confirm-dialog/ConfirmDialog";
import BuildingDisplay from "../../components/gameplay/building-display/BuildingDisplay";
import GameTimer from "../../components/gameplay/game-timer/GameTimer";
import GameWorld from "../../components/gameplay/game-world/GameWorld";
import HeroStatsDisplay from "../../components/gameplay/hero-stats-display/HeroStatsDisplay";
import QuestPerform from "../../components/gameplay/quest-perform/QuestPerform";
import QuestProgressList from "../../components/gameplay/quest-travel/quest-travel-list/QuestTravelList";
import Loader from "../../components/loader/Loader";
import withApiService, { WithApiServiceProps } from "../../hoc/WithApiService";
import Hero from "../../models/hero/Hero";
import Quest from "../../models/Quest";
import "./gameplay-page.scss";

type GameplayProps = {};

type GameplayState = {
  resized: boolean;
};

class GameplayPage extends Component<GameplayProps, GameplayState> {
  constructor(props: GameplayProps) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  /**
   * Дабы учитывать высоту поисковой панельки в мобиле https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
   * При ресайзе просто передергиваем проперти в стейте чтобы обновился рендер
   */
  handleResize() {
    this.setState({ resized: true });
  }

  render() {
    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);

    return (
      <section className="gameplay-page">
        {/** Пока делаем мобилку выключаем тултип */
        /* <GameplayTooltip /> */}
        <GameWorld />
        <GameTimer />
        <BuildingDisplay />
        <HeroStatsDisplay />
        <QuestProgressList />
        <QuestPerform />
        <ConfirmDialog />
      </section>
    );
  }
}

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
