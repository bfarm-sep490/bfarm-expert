import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, List } from "@refinedev/antd";

import { useState } from "react";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { useLocation } from "react-router";
import { PlanListCard, PlanListTable, PlanSelectionModal } from "@/components/plan";

type View = "table" | "card";

export const PlanList = () => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();
  const [showModal, setShowModal] = useState(false);

  const [view, setView] = useState<View>((localStorage.getItem("plan-view") as View) || "table");

  const handleViewChange = (value: View) => {
    replace("");
    setView(value);
    localStorage.setItem("plan-view", value);
  };

  const handleCreateWithOrders = (orderIds: string[]) => {
    go({
      to: `${createUrl("plans")}`,
      query: {
        to: pathname,
        orderIds: orderIds.join(","),
      },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  const handleCreateNormal = () => {
    go({
      to: `${createUrl("plans")}`,
      query: {
        to: pathname,
      },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  const t = useTranslate();

  return (
    <>
      <List
        breadcrumb={false}
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
            onClick={() => setShowModal(true)}
          >
            {t("plans.actions.add", "Add Plan")}
          </CreateButton>,
        ]}
      >
        {view === "table" && <PlanListTable />}
        {view === "card" && <PlanListCard />}
      </List>

      <PlanSelectionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreateWithOrders={handleCreateWithOrders}
        onCreateNormal={handleCreateNormal}
      />
    </>
  );
};
