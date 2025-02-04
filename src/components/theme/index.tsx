import { theme } from "antd";

export const themeConfig = {
  algorithm: [theme.defaultAlgorithm, theme.compactAlgorithm],
  token: {
    // Colors
    colorPrimary: "#00b96b",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1890ff",

    // Component tokens
    colorLink: "#00b96b",
    colorLinkHover: "#36d992",
  },
  components: {
    Button: {
      colorPrimary: "#00b96b",
      algorithm: true,
    },
    Input: {
      colorPrimary: "#00b96b",
      algorithm: true,
    },
    Select: {
      colorPrimary: "#00b96b",
      algorithm: true,
    },
    Card: {
      colorPrimary: "#00b96b",
      algorithm: true,
    },
    Table: {
      colorPrimary: "#00b96b",
      algorithm: true,
    },
    Menu: {
      colorPrimary: "#00b96b",
      algorithm: true,
    },
    Layout: {
      colorPrimary: "#fff",
      algorithm: true,
    },
  },
};
