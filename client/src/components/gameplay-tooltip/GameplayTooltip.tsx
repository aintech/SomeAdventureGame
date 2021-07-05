import { connect } from "react-redux";
import "./gameplay-tooltip.scss";

export type Tooltip = {
  message: string;
  appear: boolean;
};

type GameplayTooltipProps = {
  tooltip: Tooltip;
};

const GameplayTooltip = ({ tooltip }: GameplayTooltipProps) => {
  let className = "gameplay-tooltip";

  if (tooltip.appear) {
    className += " gameplay-tooltip__popup";
  }

  return (
    <div className={className}>
      <div className="gameplay-tooltip__holder">
        <div className="gameplay-tooltip__message">{tooltip.message}</div>
      </div>
    </div>
  );
};

type GameplayTooltipState = {
  tooltip: Tooltip;
};

const mapStateToProps = ({ tooltip }: GameplayTooltipState) => {
  return { tooltip };
};

export default connect(mapStateToProps, null)(GameplayTooltip);
