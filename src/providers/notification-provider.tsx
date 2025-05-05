import { UndoableNotification } from "@/components/undoableNotification";
import type { NotificationProvider } from "@refinedev/core";
import { toast, ToastPosition } from "react-toastify";

export const notificationProvider: NotificationProvider = {
  open: ({ key, message, type, undoableTimeout, cancelMutation }) => {
    const toastTheme = {
      position: "top-right" as ToastPosition,
      theme: "colored",
      style: {
        borderRadius: "8px",
      },
    };

    if (type === "progress") {
      if (toast.isActive(key as string | number)) {
        toast.update(key as string | number, {
          progress: undoableTimeout && (undoableTimeout / 10) * 2,
          render: <UndoableNotification message={message} cancelMutation={cancelMutation} />,
          type: "default",
          ...toastTheme,
        });
      } else {
        toast(<UndoableNotification message={message} cancelMutation={cancelMutation} />, {
          toastId: key,
          updateId: key,
          closeOnClick: false,
          closeButton: false,
          autoClose: false,
          progress: undoableTimeout && (undoableTimeout / 10) * 2,
          ...toastTheme,
        });
      }
    } else {
      if (toast.isActive(key as string | number)) {
        toast.update(key as string | number, {
          render: message,
          closeButton: true,
          autoClose: 5000,
          type,
          ...toastTheme,
        });
      } else {
        toast(message, {
          toastId: key,
          type,
          ...toastTheme,
        });
      }
    }
  },
  close: (key) => toast.dismiss(key),
};
