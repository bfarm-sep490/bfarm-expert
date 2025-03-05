import { Tag, Typography, theme } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import { useConfigProvider } from "../../../context";
import { IPlan } from "../../../interfaces";

type Props = {
  value: IPlan["status"];
};

export const PlanStatus = ({ value }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const { mode } = useConfigProvider();
  const isDark = mode === "dark";

  const statusStyles = {
    Pending: {
      color: token?.colorWarning,
      icon: <ClockCircleOutlined />,
      textColor: isDark ? token.yellow6 : "#D4B106",
    },
    Ongoing: {
      color: token?.colorPrimary,
      icon: <SyncOutlined spin />,
      textColor: isDark ? token.blue5 : token.colorPrimary,
    },
    Completed: {
      color: token?.colorSuccess,
      icon: <CheckCircleOutlined />,
      textColor: isDark ? token.green7 : "#3C8618",
    },
    Cancelled: {
      color: token?.colorError,
      icon: <StopOutlined />,
      textColor: isDark ? token.red6 : token.colorError,
    },
  };

  const currentStyle = statusStyles[value as keyof typeof statusStyles];

  return (
    <Tag
      color={currentStyle?.color}
      style={{
        color: currentStyle?.textColor,
        marginInlineEnd: 0,
      }}
      icon={currentStyle?.icon}
    >
      <Typography.Text
        style={{
          color: currentStyle?.textColor,
        }}
      >
        {t(`plans.status.${value?.toLowerCase()}`)}
      </Typography.Text>
    </Tag>
  );
};
