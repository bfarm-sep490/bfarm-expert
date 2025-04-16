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
  itemsOptions: { label: string; value: number }[];
  packagingTypesOptions: { label: string; value: number }[];
  identity: { name: string } | undefined;
}

export const TasksSection: React.FC<TasksSectionProps> = ({
  formProps,
  selectedTemplate,
  yieldsOptions,
  fertilizersOptions,
  pesticidesOptions,
  itemsOptions,
  packagingTypesOptions,
  identity,
}) => {
  return (
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
        itemsOptions={itemsOptions}
        packagingTypesOptions={packagingTypesOptions}
        identity={identity}
      />
    </Space>
  );
};

export * from "./CareTasksPanel";
export * from "./HarvestTasksPanel";
export * from "./InspectionTasksPanel";
export * from "./PackagingTasksPanel";
export * from "./ProductionInfo";
