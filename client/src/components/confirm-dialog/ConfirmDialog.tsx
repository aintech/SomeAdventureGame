import React, { MouseEvent } from "react";
import { connect, useDispatch } from "react-redux";
import { showConfirmDialog } from "../../actions/Actions";
import "./confirm-dialog.scss";

export type ConfirmDialogType = {
  message: string;
  callback: (e: MouseEvent) => void;
  event: MouseEvent;
};

export type ConfirmDialogProps = {
  confirmDialog: ConfirmDialogType | null;
};

const ConfirmDialog = ({ confirmDialog }: ConfirmDialogProps) => {
  const dispatch = useDispatch();

  if (!confirmDialog) {
    return null;
  }

  const acceptHandler = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    confirmDialog.callback(confirmDialog.event);
    dispatch(showConfirmDialog());
  };

  const cancelHandler = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(showConfirmDialog());
  };

  return (
    <div className={"confirm-dialog"} onClick={(e) => cancelHandler(e)}>
      <div className="confirm-dialog__container">
        <div className="confirm-dialog__message">
          {confirmDialog.message}
          <hr />
        </div>
        <div
          className="confirm-dialog__accept-btn"
          onClick={(e) => acceptHandler(e)}
        >
          <span className="confirm-dialog__accept-btn__text">Подтвердить</span>
        </div>
        <div
          className="confirm-dialog__cancel-btn"
          onClick={(e) => cancelHandler(e)}
        >
          <span className="confirm-dialog__cancel-btn__text">Отменить</span>
        </div>
      </div>
    </div>
  );
};

type ConfirmDialogState = {
  confirmDialog: ConfirmDialogType | null;
};

const mapStateToProps = ({ confirmDialog }: ConfirmDialogState) => {
  return { confirmDialog };
};

export default connect(mapStateToProps)(ConfirmDialog);
