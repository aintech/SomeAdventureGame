import React, { Component } from "react";
import { BuildingType, toDisplay } from "../../../../models/Building";
import "./storage-display.scss";

type StorageDisplayProps = {
  closeDisplay: () => void;
};

const StorageDisplay = ({ closeDisplay }: StorageDisplayProps) => {
  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "storage-display") {
      closeDisplay();
    }
  };

  return (
    <div className="storage-display" id="storage-display" onClick={clickHandler}>
      <button className="storage-display__btn--close" onClick={closeDisplay}></button>
      <div className="storage-display__container">
        <div className="storage-display__name">{toDisplay(BuildingType.STORAGE)}</div>
      </div>
    </div>
  );
};

type StorageDisplayContainerProps = {
  closeDisplay: () => void;
};

class StorageDisplayContainer extends Component<StorageDisplayContainerProps> {
  render() {
    const { closeDisplay } = this.props;

    return <StorageDisplay closeDisplay={closeDisplay} />;
  }
}

// type StorageDisplayContainerState = {
//   heroes: Hero[];
// };

// const mapStateToProps = ({ heroes }: StorageDisplayContainerState) => {
//   return { heroes };
// };

// const mapDispatchToProps = (dispatch: Dispatch) => {
//   return bindActionCreators(
//     {
//       heroClicked: heroStatsChoosed,
//     },
//     dispatch
//   );
// };

// export default connect(mapStateToProps, mapDispatchToProps)(StorageDisplayContainer);
export default StorageDisplayContainer;
