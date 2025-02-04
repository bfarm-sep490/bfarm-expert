import React from "react";
import { Authenticated, IResourceItem, Refine } from "@refinedev/core";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import {
  useNotificationProvider,
  ThemedLayoutV2,
  ErrorComponent,
} from "@refinedev/antd";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import {
  CalendarOutlined,
  CarOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  GoldOutlined,
  HddOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import jsonServerDataProvider from "@refinedev/simple-rest";
import { authProvider } from "./authProvider";

import "dayjs/locale/vi";

import { DashboardPage } from "./pages/dashboard";
import { AuthPage } from "./pages/auth";
import { CustomerShow, CustomerList } from "./pages/customers";
import { useTranslation } from "react-i18next";
import { Header, Title } from "./components";
import { ConfigProvider } from "./context";
import { useAutoLoginForDemo } from "./hooks";

import "@refinedev/antd/dist/reset.css";
import {
  FarmerManagementCreate,
  FarmerManagementEdit,
  FarmerManagementList,
  FarmerManagementShow,
} from "./pages/farmer-managements";
import { DeviceList } from "./pages/devices";
import { themeConfig } from "./components/theme";
import { ThemedSiderV2 } from "./components/layout/sider";

import { liveProvider } from "@refinedev/ably";
import { ablyClient } from "./utils/ablyClient";


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
              liveMode: "off"
            }}
            notificationProvider={useNotificationProvider}
            liveProvider={liveProvider(ablyClient)}
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
                name: "users",
                list: "/customers",
                show: "/customers/:id",
                meta: {
                  label: "Farmer Management",
                  icon: <UserOutlined />,
                },
              },
              {
                name: "device",
                list: "/device",
                create: "/device/create",
                edit: "/device/edit/:id",
                show: "/device/show/:id",
                meta: {
                  label: "Device",
                  icon: <HddOutlined />,
                },
              },
              {
                name: "inspection",
                list: "/inspection",
                create: "/inspection/create",
                edit: "/inspection/edit/:id",
                show: "/inspection/show/:id",
                meta: {
                  label: "Inspection",
                  icon: <SearchOutlined />,
                },
              },
              {
                name: "land-management",
                list: "/land-management",
                create: "/land-management/create",
                edit: "/land-management/edit/:id",
                show: "/land-management/show/:id",
                meta: {
                  label: "Land Management",
                  icon: <EnvironmentOutlined />,
                },
              },
              {
                name: "material",
                meta: {
                  label: "Material",
                  icon: <GoldOutlined />,
                },
              },
              {
                name: "fertilizers",
                list: "/fertilizers",
                create: "/fertilizers/create",
                edit: "/fertilizers/edit/:id",
                show: "/fertilizers/show/:id",
                meta: { parent: "material", canDelete: true },
              },
              {
                name: "pesticide",
                list: "/pesticide",
                create: "/pesticide/create",
                edit: "/pesticide/edit/:id",
                show: "/pesticide/show/:id",
                meta: { parent: "material", canDelete: true },
              },
              {
                name: "season-management",
                list: "/season-management",
                create: "/season-management/create",
                edit: "/season-management/edit/:id",
                show: "/season-management/show/:id",
                meta: {
                  label: "Season Management",
                  icon: <CalendarOutlined />,
                },
              },
              {
                name: "report",
                list: "/report",
                create: "/report/create",
                edit: "/report/edit/:id",
                show: "/report/show/:id",
                meta: {
                  label: "Report",
                  icon: <FileTextOutlined />,
                },
              },
              {
                name: "support",
                list: "/support",
                create: "/support/create",
                edit: "/support/edit/:id",
                show: "/support/show/:id",
                meta: {
                  label: "Support",
                  icon: <CustomerServiceOutlined />,
                },
              },
              {
                name: "transport",
                list: "/transport",
                create: "/transport/create",
                edit: "/transport/edit/:id",
                show: "/transport/show/:id",
                meta: {
                  label: "Transport",
                  icon: <CarOutlined />,
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

                <Route
                  path="/customers"
                  element={
                    <CustomerList>
                      <Outlet />
                    </CustomerList>
                  }
                >
                  <Route path=":id" element={<CustomerShow />} />
                </Route>

                <Route path="/device" element={<DeviceList />}>
                  <Route path=":id" element={<FarmerManagementShow />} />
                  <Route path="new" element={<FarmerManagementCreate />} />
                  <Route path=":id/edit" element={<FarmerManagementEdit />} />
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
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
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
