import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { onHeroActivities } from "../../../actions/ApiActions";
import withApiService, {
  WithApiServiceProps,
} from "../../../hoc/WithApiService";
import Hero from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivityType";
import checkHeroActivity from "./ActivityChecker";

type GameTimerProps = {
  heroes: Hero[];
  onHeroActivities: (
    activities: { heroId: number; type: HeroActivityType }[]
  ) => void;
};

class GameTimer extends Component<GameTimerProps> {
  private secondsTimer: NodeJS.Timeout | null = null;

  constructor(props: GameTimerProps) {
    super(props);
    this.startTimers = this.startTimers.bind(this);
    this.countSeconds = this.countSeconds.bind(this);
  }

  componentDidMount() {
    this.startTimers();
  }

  componentWillUnmount() {
    if (this.secondsTimer) {
      clearInterval(this.secondsTimer);
    }
  }

  startTimers() {
    if (!this.secondsTimer) {
      this.secondsTimer = setInterval(this.countSeconds, 1000);
    }
  }

  countSeconds() {
    this.checkHeroes();
  }

  checkHeroes() {
    const { heroes } = this.props;
    const activities: { heroId: number; type: HeroActivityType }[] = [];

    for (const hero of heroes) {
      const activity = checkHeroActivity(hero);
      if (activity != null) {
        activities.push({ heroId: hero.id, type: activity });
      }
    }

    if (activities.length > 0) {
      this.props.onHeroActivities(activities);
    }
  }

  render() {
    return null;
  }
}

type GameTimerState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: GameTimerState) => {
  return { heroes };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  customProps: WithApiServiceProps
) => {
  const { apiService, auth } = customProps;

  return bindActionCreators(
    {
      onHeroActivities: onHeroActivities(apiService, auth),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(GameTimer);
