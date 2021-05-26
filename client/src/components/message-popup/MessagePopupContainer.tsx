import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useDismissMessage } from "../../hooks/UseDisplayMessages";
import "./message-popup-container.scss";
import MessagePopup, { Message } from "./MessagePopup";

type MessagePopupContainerProps = {
  messages: Message[];
};

const MessagePopupContainer = ({ messages }: MessagePopupContainerProps) => {
  const dismiss = useDismissMessage();

  const checkOldMessages = () => {
    for (const message of messages) {
      if (message.id + 5000 < new Date().getTime()) {
        dismiss(message.id);
        return;
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => checkOldMessages(), 1000);
    return () => clearInterval(timer);
  });

  if (!messages) {
    return null;
  }

  const messageRender = (message: Message) => {
    return (
      <li key={message.id}>
        <MessagePopup message={message} onDismiss={dismiss} />
      </li>
    );
  };

  return (
    <div className="message-popup-container">
      <ul>{messages.map((m) => messageRender(m))}</ul>
    </div>
  );
};

const mapStateToProps = ({ messages }: { messages: Message[] }) => {
  return { messages };
};

export default connect(mapStateToProps, null)(MessagePopupContainer);
