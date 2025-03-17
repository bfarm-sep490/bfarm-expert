import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => {
  return {
    card: {
      position: "relative",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.07)",
      transition: "all 0.3s",
      ":hover": {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        ".viewButton": {
          display: "block !important",
        },
      },
    },
    cardCover: {
      position: "relative",
      height: "52px",
      background: `linear-gradient(to right, ${token.colorPrimaryBg}, ${token.colorBgLayout})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    viewButton: {
      position: "absolute",
      display: "none !important",
      width: "max-content !important",
      top: "50%",
      left: 0,
      marginLeft: "50%",
      transform: "translate(-50%, -50%)",
      padding: "5px 12px 5px 12px",
      zIndex: 1,
      backgroundColor: token.colorBgContainer,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    },
    approvalTag: {
      position: "absolute",
      top: "8px",
      right: "8px",
      padding: "2px 8px",
      zIndex: 1,
    },
    cardContent: {
      padding: "16px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    cardMeta: {
      marginBottom: "12px",
    },
    cardFooter: {
      marginTop: "auto",
      paddingTop: "12px",
      borderTop: `1px solid ${token.colorBorderSecondary}`,
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px",
    },
    icon: {
      color: token.colorTextSecondary,
      fontSize: "14px",
    },
    dateRange: {
      fontSize: "12px",
      color: token.colorTextSecondary,
    },
  };
});
