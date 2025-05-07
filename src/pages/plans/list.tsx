import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, List } from "@refinedev/antd";

import { PropsWithChildren, useState } from "react";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { useLocation } from "react-router";
import { PlanListCard, PlanListTable } from "@/components/plan";

type View = "table" | "card";

export const PlanList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();
  const [view, setView] = useState<View>((localStorage.getItem("plan-view") as View) || "table");

  const handleViewChange = (value: View) => {
    replace("");
    setView(value);
    localStorage.setItem("plan-view", value);
  };

  const t = useTranslate();

  return (
    <>
      <List
        breadcrumb={false}
        title={t("plans.plans")}
        headerButtons={(props) => [
          <Segmented<View>
            key="view"
            size="large"
            value={view}
            style={{ marginRight: 24 }}
            options={[
              {
                label: "",
                value: "table",
                icon: <UnorderedListOutlined />,
              },
              {
                label: "",
                value: "card",
                icon: <AppstoreOutlined />,
              },
            ]}
            onChange={handleViewChange}
          />,
          <CreateButton
            {...props.createButtonProps}
            key="create"
            size="large"
            onClick={() => {
              return go({
                to: `${createUrl("plans")}`,
                query: {
                  to: pathname,
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          >
            {t("plans.actions.add")}
          </CreateButton>,
        ]}
      >
        {view === "table" && <PlanListTable />}
        {view === "card" && <PlanListCard />}
      </List>

      {children}
    </>
  );
};
