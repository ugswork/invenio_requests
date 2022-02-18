import React, { Component } from "react";
import PropTypes from "prop-types";
import { TimelineEvent } from "../timelineEvent";
import { errorSerializer } from "../api/serializers";

class TimelineEventWithState extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isEditing: false,
      error: null,
    };
  }

  toggleEditMode = () => {
    const { isEditing } = this.state;

    this.setState({ isEditing: !isEditing, error: null });
  };

  updateComment = async (content, format) => {
    const { updateComment, event } = this.props;

    if (!content) return;

    this.setState({
      isLoading: true,
    });

    try {
      await updateComment({ content, format, event });

      this.setState({
        isLoading: false,
        isEditing: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        isEditing: true,
        error: errorSerializer(error),
      });
    }
  };

  deleteComment = async () => {
    const { deleteComment, event, openConfirmModal } = this.props;

    openConfirmModal({
      text: "Are you sure you want to delete this comment?",
      action: () => deleteComment({ event }),
    });
  };

  render() {
    const { event } = this.props;

    return (
      <TimelineEvent
        updateComment={this.updateComment}
        deleteComment={this.deleteComment}
        toggleEditMode={this.toggleEditMode}
        {...this.state}
        event={event}
      />
    );
  }
}

TimelineEventWithState.propTypes = {
  event: PropTypes.object.isRequired,
  updateComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  openConfirmModal: PropTypes.func,
};

export default TimelineEventWithState;