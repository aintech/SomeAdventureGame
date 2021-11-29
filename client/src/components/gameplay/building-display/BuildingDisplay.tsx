import React, { Component, MouseEvent } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { buildingClicked, showConfirmDialog } from "../../../actions/Actions";
import { onCompleteBuildingUpgrade, onStartBuildingUpgrade } from "../../../actions/ApiActions";
import withApiService, { WithApiServiceProps } from "../../../hoc/WithApiService";
import Building, { BuildingType, toDisplay } from "../../../models/Building";
import GameStats from "../../../models/GameStats";
import { convertDuration } from "../../../utils/Utils";
import AlchemistDisplay from "./alchemist-display/AlchemistDisplay";
import BlacksmithDisplay from "./blacksmith-display/BlacksmithDisplay";
import "./building-display.scss";
import DwellingsDisplay from "./dwellings-display/DwellingsDisplay";
import ElderDisplay from "./elder-display/ElderDisplay";
import GuildDisplay from "./guild-display/GuildDisplay";
import HealerDisplay from "./healer-display/HealerDisplay";
import MarketDisplay from "./market-display/MarketDisplay";
import StablesDisplay from "./stables-display/StablesDisplay";
import TavernDisplay from "./tavern-display/TavernDisplay";
import TrainingGroundDisplay from "./training-ground-display/TrainingGroundDisplay";
import TreasuryDisplay from "./treasury-display/TreasuryDisplay";

type BuildingDisplayProps = {
  stats: GameStats;
  chosenBuilding?: Building;
  hideBuildingDisplay: () => void;
  showConfirmDialog: (message: string, callback: (e: MouseEvent) => void) => void;
  onStartBuildingUpgrade: (type: BuildingType) => void;
  completeBuildingUpgrade: (type: BuildingType) => void;
};

type BuildingDisplayState = {
  upgradeSecs?: number;
  vh?: number;
};

class BuildingDisplay extends Component<BuildingDisplayProps, BuildingDisplayState> {
  private secondsTimer?: NodeJS.Timeout;

  constructor(props: BuildingDisplayProps) {
    super(props);
    this.startTimers = this.startTimers.bind(this);
    this.countSeconds = this.countSeconds.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    const { chosenBuilding } = this.props;

    let upgradeSecs = undefined;
    if (chosenBuilding?.upgrade?.upgradeStarted) {
      upgradeSecs = chosenBuilding.upgrade.duration! - (new Date().getTime() - chosenBuilding.upgrade.upgradeStarted) * 0.001;
    }

    this.setState({ upgradeSecs });

    if (upgradeSecs) {
      this.startTimers();
    }
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    if (this.secondsTimer) {
      clearInterval(this.secondsTimer);
    }
  }

  /** Дабы учитывать высоту поисковой панельки в мобиле https://css-tricks.com/the-trick-to-viewport-units-on-mobile/  */
  handleResize() {
    this.setState({ vh: window.innerHeight * 0.01 });
  }

  startTimers() {
    if (!this.secondsTimer) {
      this.secondsTimer = setInterval(this.countSeconds, 1000);
    }
  }

  countSeconds() {
    const { chosenBuilding } = this.props;

    if (chosenBuilding?.upgrade?.upgradeStarted) {
      let upgradeSecs: number | undefined = chosenBuilding.upgrade.duration! - (new Date().getTime() - chosenBuilding.upgrade.upgradeStarted) * 0.001;
      if (upgradeSecs <= 0) {
        upgradeSecs = undefined;
        if (this.secondsTimer) {
          clearInterval(this.secondsTimer);
        }
        this.props.completeBuildingUpgrade(chosenBuilding.type);
      }

      this.setState({
        upgradeSecs,
      });
    }
  }

  upgradeBuilding() {
    this.props.onStartBuildingUpgrade(this.props.chosenBuilding!.type);
    this.startTimers();
  }

  showUpgradeConfirm(e: MouseEvent) {
    e.stopPropagation();
    const { chosenBuilding } = this.props;
    this.props.showConfirmDialog(
      `Здание будет улучшено до уровня ${chosenBuilding!.level + 1}
         за ${chosenBuilding!.upgrade!.cost} монет,
         обновление займёт ${convertDuration(chosenBuilding!.upgrade!.duration)}`,
      this.upgradeBuilding.bind(this)
    );
  }

  render() {
    const { stats, chosenBuilding } = this.props;

    if (!chosenBuilding) {
      return null;
    }

    if (typeof chosenBuilding.type !== "number") {
      return null;
    }

    const upgradeDisabled = stats.gold < (chosenBuilding.upgrade?.cost ?? Number.MAX_SAFE_INTEGER);

    const upgradeBtn =
      chosenBuilding.upgrade && !chosenBuilding.upgrade?.upgradeStarted ? (
        <button
          className={`building-display__btn-upgrade${upgradeDisabled ? " btn-upgrade_disabled" : ""}`}
          onClick={this.showUpgradeConfirm.bind(this)}
          disabled={upgradeDisabled}
        >
          &uarr;
        </button>
      ) : null;

    const upgradeMsg =
      chosenBuilding?.upgrade?.upgradeStarted && this.state?.upgradeSecs ? (
        <div className="building-display__msg-upgrade">
          Здание в процессе улучшения
          <span className="building-display__msg-upgrade__span"> {convertDuration(this.state.upgradeSecs)}</span>
        </div>
      ) : null;

    document.documentElement.style.setProperty("--vh", `${this.state?.vh ?? window.innerHeight * 0.01}px`);

    return (
      <div className="building-display" onClick={this.props.hideBuildingDisplay}>
        <div className="building-display__container" onClick={(e) => e.stopPropagation()}>
          <div className="building-display__title">
            {upgradeBtn}
            <div className="building-display__title_name">{toDisplay(chosenBuilding.type)}</div>
            <button className="building-display__btn-close" onClick={this.props.hideBuildingDisplay}></button>
          </div>
          <hr className="title__underscore" />
          <div className="building-display__display-content">{displayByType(chosenBuilding.type)}</div>
          {upgradeMsg}
        </div>
      </div>
    );
  }
}

const displayByType = (type: BuildingType) => {
  switch (type) {
    case BuildingType.GUILD:
      return <GuildDisplay />;
    case BuildingType.TAVERN:
      return <TavernDisplay />;
    case BuildingType.DWELLINGS:
      return <DwellingsDisplay />;
    case BuildingType.STABLES:
      return <StablesDisplay />;
    case BuildingType.HEALER:
      return <HealerDisplay />;
    case BuildingType.ENERGY_HUB:
      return <TreasuryDisplay />;
    case BuildingType.TRAINING_GROUND:
      return <TrainingGroundDisplay />;
    case BuildingType.ALCHEMIST:
      return <AlchemistDisplay />;
    case BuildingType.BLACKSMITH:
      return <BlacksmithDisplay />;
    case BuildingType.MARKET:
      return <MarketDisplay />;
    case BuildingType.ELDER:
      return <ElderDisplay />;
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};

class BuildingDisplayContainer extends Component<BuildingDisplayProps> {
  render() {
    const { stats, chosenBuilding, hideBuildingDisplay, showConfirmDialog, onStartBuildingUpgrade, completeBuildingUpgrade } = this.props;

    if (!chosenBuilding) {
      return null;
    }

    if (typeof chosenBuilding.type !== "number") {
      return null;
    }

    return (
      <BuildingDisplay
        stats={stats}
        chosenBuilding={chosenBuilding}
        hideBuildingDisplay={hideBuildingDisplay}
        showConfirmDialog={showConfirmDialog}
        onStartBuildingUpgrade={onStartBuildingUpgrade}
        completeBuildingUpgrade={completeBuildingUpgrade}
      />
    );
  }
}

type BuildingDisplayMapState = {
  stats: GameStats;
  chosenBuilding: Building;
};

const mapStateToProps = ({ stats, chosenBuilding }: BuildingDisplayMapState) => {
  return { stats, chosenBuilding };
};

const mapDispatchToProps = (dispatch: Dispatch, customProps: WithApiServiceProps) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      hideBuildingDisplay: buildingClicked,
      showConfirmDialog,
      onStartBuildingUpgrade: onStartBuildingUpgrade(apiService, auth),
      completeBuildingUpgrade: onCompleteBuildingUpgrade(apiService, auth),
    },
    dispatch
  );
};

export default compose(withApiService(), connect(mapStateToProps, mapDispatchToProps))(BuildingDisplayContainer);
