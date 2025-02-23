import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    backgroundColor: token.colorBgElevated,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    transition: "box-shadow 0.2s ease-in-out",

    "&.scrolled": {
      boxShadow: token.boxShadowSecondary,
    },
  },
  headerTitle: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    fontWeight: "bold",
    borderBottom: "1px",
  },
  inputSuffix: {
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: token.colorBgTextHover,
    color: token.colorTextDisabled,
    borderRadius: "4px",
    fontSize: "12px",
  },
  inputPrefix: {
    color: token.colorTextPlaceholder,
    marginRight: "4px",
  },
  languageSwitchText: {
    color: token.colorTextSecondary,
  },
  languageSwitchIcon: {
    color: token.colorTextTertiary,
    width: "10px",
  },
  themeSwitch: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "32px",
    width: "32px",
    minWidth: "32px",
    padding: "0",
    margin: "0",
    borderRadius: "50%",
    cursor: "pointer",
    backgroundColor: token.colorBgTextHover,
    lineHeight: 1,
    border: "none",

    "& > span, & .anticon": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      margin: 0,
      padding: 0,
    },

    "& .anticon": {
      fontSize: "16px", // Adjust icon size if needed
      position: "static", // Prevent any automatic positioning
      transform: "none", // Prevent any transforms
    },

    "&.ant-btn": {
      padding: 0,
      margin: 0,
    },
  },
  userName: {
    display: "flex !important",
    color: token.colorTextHeading,
    fontSize: "14px",
  },
}));
