import { UseFormReturnType } from "@refinedev/antd";
import { Card, Tabs, Space, Tag } from "antd";
import { ToolOutlined, CheckOutlined, FileSearchOutlined, InboxOutlined } from "@ant-design/icons";
import { IPlant } from "@/interfaces";
import { CareTasksPanel } from "./CareTasksPanel";
import { HarvestTasksPanel } from "./HarvestTasksPanel";
import { InspectionTasksPanel } from "./InspectionTasksPanel";
import { PackagingTasksPanel } from "./PackagingTasksPanel";
import { useTaskStore } from "@/store/task-store";
import { useEffect } from "react";

interface TasksTabsProps {
  formProps: UseFormReturnType<IPlant>["formProps"];
  fertilizersOptions: { label: string; value: number }[];
  pesticidesOptions: { label: string; value: number }[];
  itemsOptions: { label: string; value: number }[];
  packagingTypesOptions: { label: string; value: number }[];
  identity: { name: string } | undefined;
  orders: {
    id: string;
    quantity: number;
    estimate_pick_up_date: string;
    plant_id: number;
    packaging_type_id: number;
  }[];
}

export const TasksTabs: React.FC<TasksTabsProps> = ({
  formProps,
  fertilizersOptions,
  pesticidesOptions,
  itemsOptions,
  packagingTypesOptions,
  identity,
  orders,
}) => {
  const { counts, setCount } = useTaskStore();

  useEffect(() => {
    setCount("caring", formProps.form?.getFieldValue("caring_tasks")?.length || 0);
    setCount("harvesting", formProps.form?.getFieldValue("harvesting_tasks")?.length || 0);
    setCount("inspecting", formProps.form?.getFieldValue("inspecting_forms")?.length || 0);
    setCount("packaging", formProps.form?.getFieldValue("packaging_tasks")?.length || 0);
  }, [formProps.form, setCount]);

  return (
    <Card>
      <Tabs
        type="card"
        defaultActiveKey="caring"
        items={[
          {
            key: "caring",
            label: (
              <Space>
                <ToolOutlined />
                <span>Công việc chăm sóc</span>
                {counts.caring > 0 && <Tag color="blue">{counts.caring}</Tag>}
              </Space>
            ),
            children: (
              <CareTasksPanel
                formProps={formProps}
                fertilizersOptions={fertilizersOptions}
                pesticidesOptions={pesticidesOptions}
                itemsOptions={itemsOptions}
              />
            ),
          },
          {
            key: "harvesting",
            label: (
              <Space>
                <CheckOutlined />
                <span>Công việc thu hoạch</span>
                {counts.harvesting > 0 && <Tag color="blue">{counts.harvesting}</Tag>}
              </Space>
            ),
            children: <HarvestTasksPanel formProps={formProps} itemsOptions={itemsOptions} />,
          },
          {
            key: "inspecting",
            label: (
              <Space>
                <FileSearchOutlined />
                <span>Công việc kiểm tra</span>
                {counts.inspecting > 0 && <Tag color="blue">{counts.inspecting}</Tag>}
              </Space>
            ),
            children: <InspectionTasksPanel formProps={formProps} identity={identity} />,
          },
          {
            key: "packaging",
            label: (
              <Space>
                <InboxOutlined />
                <span>Công việc đóng gói</span>
                {counts.packaging > 0 && <Tag color="blue">{counts.packaging}</Tag>}
              </Space>
            ),
            children: (
              <PackagingTasksPanel
                formProps={formProps}
                itemsOptions={itemsOptions}
                packagingTypesOptions={packagingTypesOptions}
                orders={orders}
              />
            ),
          },
        ]}
      />
    </Card>
  );
};
