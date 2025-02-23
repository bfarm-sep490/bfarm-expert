import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  sider: {
    backgroundColor: token.colorBgContainer,
    borderRight: "none",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease",
  },

  menuContainer: {
    height: "calc(100% - 72px)",
    padding: "8px",
    overflow: "auto",

    // Custom scrollbar
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: token.colorBorder,
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
  },

  logo: {
    height: "64px",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "transparent",
    borderBottom: `1px solid ${token.colorBorder}`,
    transition: "padding 0.2s ease",

    "&.collapsed": {
      padding: "0 8px",
      justifyContent: "center",
    },
  },

  menu: {
    border: "none",
    backgroundColor: "transparent",

    // Menu item styles
    ".ant-menu-item": {
      margin: "4px 8px",
      borderRadius: token.borderRadius,

      "&:hover": {
        backgroundColor: token.colorBgTextHover,
      },

      "&.ant-menu-item-selected": {
        backgroundColor: token.colorPrimary,

        "&::after": {
          display: "none",
        },

        // Icon and text color for selected items
        ".anticon, a": {
          color: token.colorWhite,
        },
      },
    },

    // Submenu styles
    ".ant-menu-submenu": {
      margin: "4px 8px",
      borderRadius: token.borderRadius,

      ".ant-menu-submenu-title": {
        margin: 0,
        borderRadius: token.borderRadius,

        "&:hover": {
          backgroundColor: token.colorBgTextHover,
        },
      },
    },
  },

  collapseButton: {
    position: "absolute",
    bottom: "12px",
    right: "-12px",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: token.colorBgContainer,
    boxShadow: token.boxShadowSecondary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 1,
    border: `1px solid ${token.colorBorder}`,

    "&:hover": {
      backgroundColor: token.colorBgTextHover,
    },

    ".anticon": {
      fontSize: "12px",
      color: token.colorTextSecondary,
    },
  },

  // Active indicator
  activeIndicator: {
    position: "absolute",
    right: 0,
    width: "3px",
    height: "24px",
    backgroundColor: token.colorPrimary,
    borderRadius: "2px 0 0 2px",
    transition: "transform 0.2s ease",
  },
}));
