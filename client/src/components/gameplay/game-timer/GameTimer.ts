import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { onHeroActivities } from "../../../actions/ApiActions";
import withApiService, { WithApiServiceProps } from "../../../hoc/WithApiService";
import Equipment from "../../../models/Equipment";
import Hero from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivity";
import Item from "../../../models/Item";
import checkHeroActivity from "./ActivityChecker";

type GameTimerProps = {
  heroes: Hero[];
  marketAssortment: Equipment[];
  alchemistAssortment: Item[];
  onHeroActivities: (activities: { heroId: number; type: HeroActivityType }[]) => void;
};

class GameTimer extends Component<GameTimerProps> {
  private secondsTimer?: NodeJS.Timeout;

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
    const { heroes, marketAssortment, alchemistAssortment } = this.props;
    const activities: { heroId: number; type: HeroActivityType }[] = [];

    const actualActivities = new Map<HeroActivityType, number>();

    heroes.forEach((h) => {
      actualActivities.set(h.activity!.type, (actualActivities.get(h.activity!.type) ?? 0) + 1);
    });

    for (const hero of heroes) {
      const activity = checkHeroActivity(hero, actualActivities, marketAssortment, alchemistAssortment);
      if (activity != null) {
        actualActivities.set(activity, (actualActivities.get(activity) ?? 0) + 1);
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
  marketAssortment: Equipment[];
  alchemistAssortment: Item[];
};

const mapStateToProps = ({ heroes, marketAssortment, alchemistAssortment }: GameTimerState) => {
  return { heroes, marketAssortment, alchemistAssortment };
};

const mapDispatchToProps = (dispatch: Dispatch, customProps: WithApiServiceProps) => {
  const { apiService, auth } = customProps;

  return bindActionCreators(
    {
      onHeroActivities: onHeroActivities(apiService, auth),
    },
    dispatch
  );
};

export default compose(withApiService(), connect(mapStateToProps, mapDispatchToProps))(GameTimer);
