import { UseFormReturnType } from "@refinedev/antd";
import { Space } from "antd";
import { IPlant, Template } from "@/interfaces";
import { ProductionInfo } from "./ProductionInfo";
import { TasksTabs } from "./TasksTabs";

interface TasksSectionProps {
  formProps: UseFormReturnType<IPlant>["formProps"];
  selectedTemplate: Template | null;
  yieldsOptions: { label: string; value: number }[];
  fertilizersOptions: { label: string; value: number }[];
  pesticidesOptions: { label: string; value: number }[];
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

export const TasksSection: React.FC<TasksSectionProps> = ({
  formProps,
  selectedTemplate,
  yieldsOptions,
  fertilizersOptions,
  pesticidesOptions,
  packagingTypesOptions,
  identity,
  orders,
}) => {
  return (
    <div
      style={{
        maxWidth: 1024,
        margin: "0 auto",
        padding: "0 16px",
      }}
    >
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <ProductionInfo
          formProps={formProps}
          selectedTemplate={selectedTemplate}
          yieldsOptions={yieldsOptions}
        />

        <TasksTabs
          formProps={formProps}
          fertilizersOptions={fertilizersOptions}
          pesticidesOptions={pesticidesOptions}
          packagingTypesOptions={packagingTypesOptions}
          identity={identity}
          orders={orders}
        />
      </Space>
    </div>
  );
};

export * from "./CareTasksPanel";
export * from "./HarvestTasksPanel";
export * from "./InspectionTasksPanel";
export * from "./PackagingTasksPanel";
export * from "./ProductionInfo";
