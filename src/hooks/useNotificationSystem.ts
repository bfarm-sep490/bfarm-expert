import { notification } from "antd";
import { useEffect } from "react";
import { ablyClient } from "@/utils/ablyClient";
import { useGetIdentity } from "@refinedev/core";

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
  const [api, contextHolder] = notification.useNotification({
    stack: true,
  });
  const { data: user } = useGetIdentity<IIdentity>();

  useEffect(() => {
    if (!user?.id) return;

    const channel = ablyClient.channels.get(`expert-${user.id}`);

    const handleNotification = (message: { data: NotificationMessage }) => {
      const notification = message.data;

      const event = new CustomEvent(`new-notification-expert-${user.id}-received`);
      window.dispatchEvent(event);

      api.info({
        key: `ably-${notification.id}`,
        message: notification?.data?.Title || "Thông báo",
        description: notification?.data?.Body || "Bạn có thông báo mới",
        showProgress: true,
        pauseOnHover: true,
        placement: "bottomRight",
      });
    };

    channel.subscribe("Notification", handleNotification);

    return () => {
      channel.unsubscribe("Notification", handleNotification);
    };
  }, [user?.id, api]);

  return contextHolder;
};
