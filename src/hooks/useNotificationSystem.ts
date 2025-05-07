import { useEffect } from "react";
import { ablyClient } from "@/utils/ablyClient";
import { useGetIdentity } from "@refinedev/core";
import { toast } from "react-toastify";
import { useConfigProvider } from "@/context";

interface NotificationMessage {
  id: number;
  expert_id: number;
  data: {
    Title: string;
    Body: string;
  };
  is_read: boolean;
  created_date: string;
}

interface IIdentity {
  id: number;
  name: string;
  avatar?: string;
}

export const useNotificationSystem = () => {
  const { data: user } = useGetIdentity<IIdentity>();
  const { mode } = useConfigProvider();

  useEffect(() => {
    if (!user?.id) return;

    const channel = ablyClient.channels.get(`expert-${user.id}`);

    const handleNotification = (message: { data: NotificationMessage }) => {
      const notification = message.data;

      const event = new CustomEvent(`new-notification-expert-${user.id}-received`);
      window.dispatchEvent(event);

      const notificationContent = `${notification?.data?.Title}\n${notification?.data?.Body}`;

      toast(notificationContent, {
        toastId: `ably-${notification.id}`,
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
      });
    };

    channel.subscribe("Notification", handleNotification);

    return () => {
      channel.unsubscribe("Notification", handleNotification);
    };
  }, [user?.id, mode]);

  return null;
};
