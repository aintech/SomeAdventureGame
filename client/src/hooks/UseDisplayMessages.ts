import { useCallback } from "react";
import { useStore } from "react-redux";
import { PayloadedAction } from "../actions/Actions";
import { ActionType } from "../actions/ActionType";

export const useDisplayMessage = () => {
  const store = useStore();
  return useCallback(
    (message: string) => {
      if (message) {
        store.dispatch<PayloadedAction>({
          type: ActionType.SHOW_USER_MESSAGE,
          payload: { id: new Date().getTime(), message: message },
        });
      }
    },
    [store]
  );
};

export const useDismissMessage = () => {
  const store = useStore();
  return useCallback(
    (id: number) => {
      if (id) {
        store.dispatch<PayloadedAction>({
          type: ActionType.DISMISS_USER_MESSAGE,
          payload: id,
        });
      }
    },
    [store]
  );
};
