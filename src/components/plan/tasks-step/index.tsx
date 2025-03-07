import { useTranslate, useList } from "@refinedev/core";
import { Tabs, Card, Badge, Spin } from "antd";
import { useState } from "react";
import { TaskListSection } from "../task-list-section";

const { TabPane } = Tabs;

interface TasksStepProps {
  planId: number;
  fertilizerSelectProps?: any;
  pesticideSelectProps?: any;
  itemSelectProps?: any;
}
export const TasksStep: React.FC<TasksStepProps> = ({
  planId,
  fertilizerSelectProps,
  pesticideSelectProps,
  itemSelectProps,
}) => {
  const t = useTranslate();
  const [activeTab, setActiveTab] = useState("caring");

  const {
    data: caringTasksData,
    isLoading: isLoadingCaringTasks,
    refetch: refetchCaringTasks,
  } = useList({
    resource: "caring-tasks",
    filters: [{ field: "plan_id", operator: "eq", value: planId }],
  });

  const {
    data: harvestingTasksData,
    isLoading: isLoadingHarvestingTasks,
    refetch: refetchHarvestingTasks,
  } = useList({
    resource: "harvesting-tasks",
    filters: [{ field: "plan_id", operator: "eq", value: planId }],
  });

  const {
    data: packagingTasksData,
    isLoading: isLoadingPackagingTasks,
    refetch: refetchPackagingTasks,
  } = useList({
    resource: "packaging-tasks",
    filters: [{ field: "plan_id", operator: "eq", value: planId }],
  });

  const {
    data: inspectingTasksData,
    isLoading: isLoadingInspectingTasks,
    refetch: refetchInspectingTasks,
  } = useList({
    resource: "inspecting-forms",
    filters: [{ field: "plan_id", operator: "eq", value: planId }],
  });

  const caringTasks = caringTasksData?.data || [];
  const harvestingTasks = harvestingTasksData?.data || [];
  const packagingTasks = packagingTasksData?.data || [];
  const inspectingTasks = inspectingTasksData?.data || [];

  const isLoading =
    isLoadingCaringTasks ||
    isLoadingHarvestingTasks ||
    isLoadingPackagingTasks ||
    isLoadingInspectingTasks;

  return (
    <Card className="task-step-card">
      <Spin spinning={isLoading}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane
            tab={
              <span>
                <Badge count={caringTasks.length} size="small" offset={[10, 0]}>
                  {t("plans.tasks.caring", "Caring")}
                </Badge>
              </span>
            }
            key="caring"
          >
            <TaskListSection
              tasks={caringTasks}
              taskType="caring"
              planId={planId}
              onTaskAdded={refetchCaringTasks}
              onTaskDeleted={refetchCaringTasks}
              fertilizerSelectProps={fertilizerSelectProps}
              pesticideSelectProps={pesticideSelectProps}
              itemSelectProps={itemSelectProps}
              t={t}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <Badge count={harvestingTasks.length} size="small" offset={[10, 0]}>
                  {t("plans.tasks.harvesting", "Harvesting")}
                </Badge>
              </span>
            }
            key="harvesting"
          >
            <TaskListSection
              tasks={harvestingTasks}
              taskType="harvesting"
              planId={planId}
              onTaskAdded={refetchHarvestingTasks}
              onTaskDeleted={refetchHarvestingTasks}
              itemSelectProps={itemSelectProps}
              t={t}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <Badge count={packagingTasks.length} size="small" offset={[10, 0]}>
                  {t("plans.tasks.packaging", "Packaging")}
                </Badge>
              </span>
            }
            key="packaging"
          >
            <TaskListSection
              tasks={packagingTasks}
              taskType="packaging"
              planId={planId}
              onTaskAdded={refetchPackagingTasks}
              onTaskDeleted={refetchPackagingTasks}
              itemSelectProps={itemSelectProps}
              t={t}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <Badge count={inspectingTasks.length} size="small" offset={[10, 0]}>
                  {t("plans.tasks.inspecting", "Inspecting")}
                </Badge>
              </span>
            }
            key="inspecting"
          >
            <TaskListSection
              tasks={inspectingTasks}
              taskType="inspecting"
              planId={planId}
              onTaskAdded={refetchInspectingTasks}
              onTaskDeleted={refetchInspectingTasks}
              t={t}
            />
          </TabPane>
        </Tabs>
      </Spin>
    </Card>
  );
};
