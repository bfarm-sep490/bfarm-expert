import { RefineThemes } from "@refinedev/antd";

import "./config.css";
import "./toast.css";

import { ConfigProvider as AntdConfigProvider, theme, type ThemeConfig } from "antd";
import { createStyles, ThemeProvider } from "antd-style";
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";

type Mode = "light" | "dark";

type ConfigProviderContextType = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #2ecc71, #3498db);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }

    [data-theme="dark"]
      &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      &::before {
        background: linear-gradient(135deg, #1e8449, #1f618d);
      }
    }
  `,
}));

export const ConfigProviderContext = createContext<ConfigProviderContextType | undefined>(
  undefined,
);

const defaultMode: Mode = (localStorage.getItem("theme") as Mode) || "light";

type ConfigProviderProps = {
  theme?: ThemeConfig;
};

export const ConfigProvider = ({
  theme: themeFromProps,
  children,
}: PropsWithChildren<ConfigProviderProps>) => {
  const [mode, setMode] = useState<Mode>(defaultMode);

  const handleSetMode = (mode: Mode) => {
    localStorage.setItem("theme", mode);
    const html = document.querySelector("html");
    html?.setAttribute("data-theme", mode);
    setMode(mode);
  };

  // add data-theme to html tag
  useEffect(() => {
    const html = document.querySelector("html");
    html?.setAttribute("data-theme", mode);
  }, []);
  const { styles } = useStyle();
  return (
    <ConfigProviderContext.Provider value={{ mode, setMode: handleSetMode }}>
      <AntdConfigProvider
        button={{
          className: styles.linearGradientButton,
        }}
        theme={{
          ...RefineThemes.Orange,
          algorithm: mode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
          ...themeFromProps,
        }}
      >
        <ThemeProvider appearance={mode}>{children}</ThemeProvider>
      </AntdConfigProvider>
    </ConfigProviderContext.Provider>
  );
};

export const useConfigProvider = () => {
  const context = useContext(ConfigProviderContext);

  if (context === undefined) {
    throw new Error("useConfigProvider must be used within a ConfigProvider");
  }

  return context;
};
