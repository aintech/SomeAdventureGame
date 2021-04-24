import "./quest-progress-list.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import withApiService from "../../../hoc/with-api-service.js";
import QuestProgressItem from "../quest-progress-item/quest-progress-item.js";
import { fetchEmbarkedQuests } from "../../../actions/actions.js";

const QuestProgressList = ({ embarkedQuests }) => {
  return (
    <div className="quest-progress-list">
      {embarkedQuests.map((embarkedQuest) => {
        const { key: quest, value: heroes } = embarkedQuest;
        return (
          <div key={quest.id}>
            <QuestProgressItem quest={quest} heroes={heroes} />
          </div>
        );
      })}
    </div>
  );
};

class QuestProgressListContainer extends Component {
  componentDidMount() {
    this.props.fetchEmbarkedQuests();
  }

  render() {
    const { embarkedQuests } = this.props;

    if (!embarkedQuests) {
      return <div>LOADING...</div>;
    }

    return <QuestProgressList embarkedQuests={embarkedQuests} />;
  }
}

const mapStateToProps = ({ embarkedQuests }) => {
  return { embarkedQuests };
};

const mapDispatchToProps = (dispatch, customProps) => {
  const { apiService } = customProps;
  return bindActionCreators(
    {
      fetchEmbarkedQuests: fetchEmbarkedQuests(apiService),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(QuestProgressListContainer);
