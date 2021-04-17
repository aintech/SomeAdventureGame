import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { fetchBuildings, buildingClicked } from "../../actions/actions";
import withApiService from "../../hoc/with-api-service.js";

import "./gameplay-page.scss";
import BuildingItem from "../../components/building-item/building-item";
import BuildingDetails from "../../components/building-details/building-details";

const GameplayPage = ({ buildings, onBuildingClicked, chosenBuilding }) => {
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
    </div>
  );
};

class GameplayPageContainer extends Component {
  componentDidMount() {
    this.props.fetchBuildings();
  }

  render() {
    const { buildings, onBuildingClicked, chosenBuilding } = this.props;

    if (!buildings) {
      return <div>LOADING ...</div>;
    }

    return (
      <GameplayPage
        buildings={buildings}
        onBuildingClicked={onBuildingClicked}
        chosenBuilding={chosenBuilding}
      />
    );
  }
}

const mapStateToProps = ({ buildings, chosenBuilding }) => {
  return { buildings, chosenBuilding };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { apiService } = ownProps;

  return bindActionCreators(
    {
      fetchBuildings: fetchBuildings(apiService),
      onBuildingClicked: buildingClicked,
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(GameplayPageContainer);
