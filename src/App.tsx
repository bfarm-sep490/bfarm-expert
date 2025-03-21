import {
  DashboardOutlined,
  ExperimentOutlined,
  ScheduleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import "dayjs/locale/vi";

import {
  useNotificationProvider,
  ThemedLayoutV2,
  ErrorComponent,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import { Authenticated, IResourceItem, Refine } from "@refinedev/core";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";

import { authProvider } from "./authProvider";
import { Header, Title } from "./components";
import { ThemedSiderV2 } from "./components/layout/sider";
import { themeConfig } from "./components/theme";
import { ConfigProvider } from "./context";
import { App as AntdApp } from "antd";
import { AuthPage } from "./pages/auth";
import { DashboardPage } from "./pages/dashboard";
import { PlanCreate, PlanEdit, PlanList, PlanShow } from "./pages/plans";
import { dataProvider } from "./rest-data-provider";
import { PlantCreate, PlantEdit, PlantList } from "./pages/plants";
import { liveProvider } from "@refinedev/ably";
import { ablyClient } from "./utils/ablyClient";
import { ApprovingPlanDrawer } from "./pages/plans/approvaled-drawer";
import { ShowProblemList } from "./pages/plans/problem/list";
import { ProblemShowV2 } from "./pages/problems/show";
import { ShowTasksList } from "./pages/plans/tasks/show";
import { ProductiveTaskShow } from "./components/caring-task/show";
import { HarvestingTaskShow } from "./components/harvesting-task/show";
import { HarvestingUpdate } from "./pages/plans/tasks/harvesting-update";
import { PackagingTaskShow } from "./components/packaging-task/show";
import { PackagingUpdate } from "./pages/plans/tasks/packaging-update";
import { ProblemListInProblems } from "./pages/problems/list";
import { CaringCreate } from "./pages/plans/tasks/caring-create";
import { CaringUpdate } from "./pages/plans/tasks/caring-update";
import { HarvestingCreate } from "./pages/plans/tasks/harvesting-create";
import { PackagingCreate } from "./pages/plans/tasks/packaging-create";

interface TitleHandlerOptions {
  resource?: IResourceItem;
}

const customTitleHandler = ({ resource }: TitleHandlerOptions): string => {
  const baseTitle = "BFarmx Expert";
  const titleSegment = resource?.meta?.label;

  const title = titleSegment ? `${titleSegment} | ${baseTitle}` : baseTitle;
  return title;
};

const App: React.FC = () => {
  // This hook is used to automatically login the user.
  // const { loading } = useAutoLoginForDemo();

  const API_URL = "https://api.outfit4rent.online/api";

  const appDataProvider = dataProvider(API_URL);

  const { t, i18n } = useTranslation();
  interface TranslationParams {
    [key: string]: string | number;
  }

  const i18nProvider = {
    translate: (key: string, params?: TranslationParams) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  // if (loading) {
  //   return null;
  // }

  return (
    <BrowserRouter>
      <ConfigProvider theme={themeConfig}>
        <AntdApp>
          <RefineKbarProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={appDataProvider}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                liveMode: "auto",
              }}
              // notificationProvider={useNotificationProvider}
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
                  name: "plans",
                  list: "/plans",
                  create: "/plans/new",
                  edit: "/plans/edit/:id",
                  show: "/plans/:id",
                  meta: {
                    icon: <ScheduleOutlined />,
                  },
                },
                {
                  name: "problems",
                  list: "/problems",
                  show: "/problems/:id",
                  meta: {
                    label: "Vấn đề",
                    icon: <WarningOutlined />,
                    route: "/problems",
                  },
                },
                {
                  name: "plants",
                  list: "/plants",
                  create: "/plants/new",
                  edit: "/plants/:id/edit",
                  show: "/plants/show/:id",
                  meta: {
                    icon: <ExperimentOutlined />,
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

                  <Route path="/plans">
                    <Route index element={<PlanList />} />
                    <Route path="new" element={<PlanCreate />} />
                    <Route path=":id">
                      <Route
                        index
                        element={
                          <PlanShow>
                            <Outlet></Outlet>
                          </PlanShow>
                        }
                      />
                      <Route
                        path="problems"
                        element={
                          <ShowProblemList>
                            <Outlet />
                          </ShowProblemList>
                        }
                      >
                        <Route path=":id" element={<ProblemShowV2 />}></Route>
                      </Route>

                      <Route
                        path="caring-tasks"
                        element={
                          <ShowTasksList>
                            <Outlet />
                          </ShowTasksList>
                        }
                      >
                        <Route path=":taskId" element={<ProductiveTaskShow />} />
                      </Route>
                      <Route path="caring-tasks/create" element={<CaringCreate />}></Route>
                      <Route path="caring-tasks/:taskId/edit" element={<CaringUpdate />}></Route>
                      <Route
                        path="harvesting-tasks"
                        element={
                          <ShowTasksList>
                            <Outlet></Outlet>
                          </ShowTasksList>
                        }
                      >
                        <Route path=":taskId" element={<HarvestingTaskShow />} />
                      </Route>
                      <Route path="harvesting-tasks/create" element={<HarvestingCreate />}></Route>
                      <Route
                        path="harvesting-tasks/:taskId/edit"
                        element={<HarvestingUpdate />}
                      ></Route>
                      <Route
                        path="packaging-tasks"
                        element={
                          <ShowTasksList>
                            <Outlet />
                          </ShowTasksList>
                        }
                      >
                        <Route path=":taskId" element={<PackagingTaskShow />} />
                      </Route>
                      <Route path="packaging-tasks/create" element={<PackagingCreate />}></Route>
                      <Route
                        path="packaging-tasks/:taskId/edit"
                        element={<PackagingUpdate />}
                      ></Route>
                    </Route>
                    <Route path="edit/:id" element={<PlanEdit />} />
                  </Route>
                  <Route
                    path="/problems"
                    element={
                      <ProblemListInProblems>
                        <Outlet></Outlet>
                      </ProblemListInProblems>
                    }
                  >
                    <Route path=":id" element={<ProblemShowV2 />} />
                  </Route>
                  <Route path="/plants">
                    <Route
                      path=""
                      element={
                        <PlantList>
                          <Outlet />
                        </PlantList>
                      }
                    >
                      <Route path="new" element={<PlantCreate />} />
                    </Route>

                    <Route path=":id/edit" element={<PlantEdit />} />
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
                            email: "expert@gmail.com",
                            password: "1@",
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
                            email: "expert@gmail.com",
                            password: "1@",
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
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
