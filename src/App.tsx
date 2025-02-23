import {
  CalendarOutlined,
  CarOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  GoldOutlined,
  HddOutlined,
  PaperClipOutlined,
  PlaySquareOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "dayjs/locale/vi";

import { liveProvider } from "@refinedev/ably";
import { useNotificationProvider, ThemedLayoutV2, ErrorComponent } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import { Authenticated, IResourceItem, Refine } from "@refinedev/core";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import jsonServerDataProvider from "@refinedev/simple-rest";

import { authProvider } from "./authProvider";
import { Header, Title } from "./components";
import { ThemedSiderV2 } from "./components/layout/sider";
import { themeConfig } from "./components/theme";
import { ConfigProvider } from "./context";
import { useAutoLoginForDemo } from "./hooks";
import { AuthPage } from "./pages/auth";
import { DashboardPage } from "./pages/dashboard";
import { PlanCreate, PlanEdit, PlanList, PlanShow } from "./pages/plans";
import { ablyClient } from "./utils/ablyClient";

import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";

interface TitleHandlerOptions {
  resource?: IResourceItem;
}

const customTitleHandler = ({ resource }: TitleHandlerOptions): string => {
  const baseTitle = "BFarm";
  let titleSegment = resource?.meta?.label;

  const title = titleSegment ? `${titleSegment} | ${baseTitle}` : baseTitle;
  return title;
};

const App: React.FC = () => {
  // This hook is used to automatically login the user.
  const { loading } = useAutoLoginForDemo();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const dataProvider = jsonServerDataProvider(API_URL);

  const { t, i18n } = useTranslation();
  interface TranslationParams {
    [key: string]: string | number;
  }

  const i18nProvider = {
    translate: (key: string, params?: TranslationParams) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <ConfigProvider theme={themeConfig}>
        <RefineKbarProvider>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              liveMode: "off",
            }}
            notificationProvider={useNotificationProvider}
            // liveProvider={liveProvider(ablyClient)}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Dashboard",
                  icon: <DashboardOutlined />,
                },
              },
              {
                name: "plan",
                list: "/plan",
                create: "/plan/create",
                edit: "/plan/edit/:id",
                show: "/plan/show/:id",
                meta: {
                  icon: <PaperClipOutlined />,
                },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2
                      Sider={() => <ThemedSiderV2 Title={Title} fixed />}
                      Header={() => <Header sticky />}
                    >
                      <div
                        style={{
                          maxWidth: "1600px",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        <Outlet />
                      </div>
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />

                <Route path="/plan">
                  <Route index element={<PlanList />} />
                  <Route path="new" element={<PlanCreate />} />
                  <Route path=":id" element={<PlanShow />} />
                  <Route path=":id/edit" element={<PlanEdit />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      formProps={{
                        initialValues: {
                          email: "demo@bfarm.dev",
                          password: "demodemo",
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <AuthPage
                      type="register"
                      formProps={{
                        initialValues: {
                          email: "demo@bfarm.dev",
                          password: "demodemo",
                        },
                      }}
                    />
                  }
                />
                <Route path="/forgot-password" element={<AuthPage type="forgotPassword" />} />
                <Route path="/update-password" element={<AuthPage type="updatePassword" />} />
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayoutV2
                      Sider={() => <ThemedSiderV2 Title={Title} fixed />}
                      Header={() => <Header sticky />}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler handler={customTitleHandler} />
            <RefineKbar />
          </Refine>
        </RefineKbarProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
