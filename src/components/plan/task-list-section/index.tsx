import { useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TaskFormModal } from "../task-form-modal";
import { SimpleTaskTable } from "../simple-task-table";

interface TaskListSectionProps {
  tasks: any[];
  taskType: string;
  planId: number;
  onTaskAdded: () => void;
  onTaskDeleted: () => void;
  fertilizerSelectProps?: any;
  pesticideSelectProps?: any;
  itemSelectProps?: any;
  t: (key: string, defaultValue?: string) => string;
}

export const TaskListSection: React.FC<TaskListSectionProps> = ({
  tasks,
  taskType,
  planId,
  onTaskAdded,
  onTaskDeleted,
  fertilizerSelectProps,
  pesticideSelectProps,
  itemSelectProps,
  t,
}) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const handleAddModalOpen = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalVisible(false);
  };

  const handleTaskAdded = () => {
    setIsAddModalVisible(false);
    onTaskAdded();
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddModalOpen}>
          {t("buttons.addTask", "Add Task")}
        </Button>

        <TaskFormModal
          taskType={taskType}
          planId={planId}
          visible={isAddModalVisible}
          onCancel={handleAddModalClose}
          onSuccess={handleTaskAdded}
          fertilizerSelectProps={fertilizerSelectProps}
          pesticideSelectProps={pesticideSelectProps}
          itemSelectProps={itemSelectProps}
        />
      </div>

      <SimpleTaskTable
        tasks={tasks}
        taskType={taskType}
        onDeleted={onTaskDeleted}
        t={t}
        fertilizerSelectProps={fertilizerSelectProps}
        pesticideSelectProps={pesticideSelectProps}
        itemSelectProps={itemSelectProps}
      />
    </div>
  );
};
