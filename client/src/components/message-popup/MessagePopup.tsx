import React from "react";
import "./message-popup.scss";

export type Message = {
  id: number;
  message: string;
};

type MessagePopupProps = {
  message: Message;
  onDismiss: (id: number) => void;
};

const MessagePopup = ({ message, onDismiss }: MessagePopupProps) => {
  return (
    <div className="message-popup" onClick={() => onDismiss(message.id)}>
      <div className="message-popup__text">{message.message}</div>
    </div>
  );
};

export default MessagePopup;
