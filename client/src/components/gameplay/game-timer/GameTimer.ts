import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { onHeroOccupations } from "../../../actions/ApiActions";
import withApiService, {
  WithApiServiceProps,
} from "../../../hoc/WithApiService";
import Hero, { calcHealthFraction } from "../../../models/hero/Hero";
import { HeroOccupationType } from "../../../models/hero/HeroOccupationType";

type GameTimerProps = {
  heroes: Hero[];
  onHeroOccupations: (
    occupations: { heroId: number; type: HeroOccupationType }[]
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
    const occupations: { heroId: number; type: HeroOccupationType }[] = [];

    heroes
      .filter(
        (h) =>
          h.occupation!.type === HeroOccupationType.IDLE &&
          !h.embarkedQuest &&
          calcHealthFraction(h) < 1
      )
      .forEach((h) =>
        occupations.push({ heroId: h.id, type: HeroOccupationType.HEALER })
      );

    if (occupations.length > 0) {
      this.props.onHeroOccupations(occupations);
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
      onHeroOccupations: onHeroOccupations(apiService, auth),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(GameTimer);
