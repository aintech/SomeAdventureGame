import React, { MouseEvent, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { buildingClicked, showConfirmDialog } from "../../../actions/Actions";
import { onStartBuildingUpgrade } from "../../../actions/ApiActions";
import withApiService, { WithApiServiceProps } from "../../../hoc/WithApiService";
import Building, { BuildingType } from "../../../models/Building";
import GameStats from "../../../models/GameStats";
import { convertDuration } from "../../../utils/Utils";
import AlchemistDisplay from "./alchemist-display/AlchemistDisplay";
import BlacksmithDisplay from "./blacksmith-display/BlacksmithDisplay";
import "./building-display.scss";
import GuildDisplay from "./guild-display/GuildDisplay";
import HealerDisplay from "./healer-display/HealerDisplay";
import MarketDisplay from "./market-display/MarketDisplay";
import StablesDisplay from "./stables-display/StablesDisplay";
import StorageDisplay from "./storage-display/StorageDisplay";
import TavernDisplay from "./tavern-display/TavernDisplay";
import TempleDisplay from "./temple-display/TempleDisplay";
import TrainingGroundDisplay from "./training-ground-display/TrainingGroundDisplay";
import TreasuryDisplay from "./treasury-display/TreasuryDisplay";

type BuildingDisplayProps = {
  stats: GameStats;
  chosenBuilding: Building;
  hideBuildingDisplay: () => void;
  showConfirmDialog: (message: string, callback: (e: MouseEvent) => void) => void;
  onStartBuildingUpgrade: (type: BuildingType) => void;
  completeBuildingUpgrade: (type: BuildingType) => void;
};

const BuildingDisplay = ({
  stats,
  chosenBuilding,
  showConfirmDialog,
  hideBuildingDisplay,
  onStartBuildingUpgrade,
  completeBuildingUpgrade,
}: BuildingDisplayProps) => {
  const [upgradeSec, setUpgradeSec] = useState<number>();

  const calcUpgradeSec = useCallback(() => {
    if (chosenBuilding?.upgrade?.upgradeStarted) {
      const secsToComplete = chosenBuilding.upgrade.duration! - (new Date().getTime() - chosenBuilding.upgrade?.upgradeStarted) * 0.001;
      if (secsToComplete <= 0) {
        completeBuildingUpgrade(chosenBuilding.type);
        setUpgradeSec(undefined);
      } else {
        setUpgradeSec(secsToComplete);
      }
    }
  }, [chosenBuilding, completeBuildingUpgrade]);

  useEffect(() => {
    calcUpgradeSec();
  }, [calcUpgradeSec]);

  useEffect(() => {
    if (!upgradeSec) {
      return;
    }

    let timer = setInterval(calcUpgradeSec, 1000);

    return () => {
      //TODO: В итоге этот кусок зовётся каждый тик таймера, может переделать всё на класс?
      clearInterval(timer);
      console.log("return");
    };
  });

  if (!chosenBuilding || typeof chosenBuilding.type !== "number") {
    return null;
  }

  const showUpgradeConfirm = (e: MouseEvent) => {
    e.stopPropagation();
    showConfirmDialog(
      `Здание будет улучшено до уровня ${chosenBuilding.level + 1} 
       за ${chosenBuilding.upgrade!.cost} монет, 
       обновление займёт ${convertDuration(chosenBuilding.upgrade!.duration)}`,
      upgradeBuilding
    );
  };

  const upgradeBuilding = () => {
    onStartBuildingUpgrade(chosenBuilding.type);
  };

  const upgradeMsg =
    chosenBuilding?.upgrade?.upgradeStarted && upgradeSec ? (
      <div className="building-display__msg-upgrade">
        Здание в процессе улучшения
        <span className="building-display__msg-upgrade__span"> {convertDuration(upgradeSec)}</span>
      </div>
    ) : null;

  const upgradeDisabled = stats.gold < (chosenBuilding.upgrade?.cost ?? Number.MAX_SAFE_INTEGER);

  const upgradeBtn =
    chosenBuilding.upgrade && !chosenBuilding.upgrade?.upgradeStarted ? (
      <button
        className={`building-display__btn-upgrade${upgradeDisabled ? " btn-upgrade_disabled" : ""}`}
        onClick={showUpgradeConfirm}
        disabled={upgradeDisabled}
      >
        &uarr; Up to lvl <span className="building-display__btn-upgrade__span">{chosenBuilding.level + 1}</span> =={" "}
        <span className="building-display__btn-upgrade__span">{chosenBuilding.upgrade.cost}</span> g ::{" "}
        <span className="building-display__btn-upgrade__span">{convertDuration(chosenBuilding.upgrade.duration)}</span>
      </button>
    ) : null;

  return (
    <div className="building-display" onClick={hideBuildingDisplay}>
      <div className="building-display__container" onClick={(e) => e.stopPropagation()}>
        <button className="building-display__btn-close" onClick={hideBuildingDisplay}></button>
        {displayByType(chosenBuilding.type)}
        {upgradeMsg}
        {upgradeBtn}
      </div>
    </div>
  );
};

const displayByType = (type: BuildingType) => {
  switch (type) {
    case BuildingType.GUILD:
      return <GuildDisplay />;
    case BuildingType.TAVERN:
      return <TavernDisplay />;
    case BuildingType.HEALER:
      return <HealerDisplay />;
    case BuildingType.TREASURY:
      return <TreasuryDisplay />;
    case BuildingType.TRAINING_GROUND:
      return <TrainingGroundDisplay />;
    case BuildingType.ALCHEMIST:
      return <AlchemistDisplay />;
    case BuildingType.TEMPLE:
      return <TempleDisplay />;
    case BuildingType.BLACKSMITH:
      return <BlacksmithDisplay />;
    case BuildingType.STABLES:
      return <StablesDisplay />;
    case BuildingType.STORAGE:
      return <StorageDisplay />;
    case BuildingType.MARKET:
      return <MarketDisplay />;
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};

type BuildingDisplayState = {
  stats: GameStats;
  chosenBuilding: Building;
};

const mapStateToProps = ({ stats, chosenBuilding }: BuildingDisplayState) => {
  return { stats, chosenBuilding };
};

const mapDispatchToProps = (dispatch: Dispatch, customProps: WithApiServiceProps) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      hideBuildingDisplay: buildingClicked,
      showConfirmDialog,
      onStartBuildingUpgrade: onStartBuildingUpgrade(apiService, auth),
    },
    dispatch
  );
};

export default compose(withApiService(), connect(mapStateToProps, mapDispatchToProps))(BuildingDisplay);
