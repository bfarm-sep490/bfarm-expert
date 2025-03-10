import { Table, Empty, TableColumnType } from "antd";
import { TaskActions } from "../task-action.tsx";

interface SimpleTaskTableProps {
  tasks: any[];
  taskType: string;
  onDeleted: () => void;
  fertilizerSelectProps?: any;
  pesticideSelectProps?: any;
  itemSelectProps?: any;

  t: (key: string, defaultValue?: string) => string;
}

export const SimpleTaskTable: React.FC<SimpleTaskTableProps> = ({
  tasks,
  taskType,
  onDeleted,
  t,
  fertilizerSelectProps,
  pesticideSelectProps,
  itemSelectProps,
}) => {
  const columns: TableColumnType<any>[] = [
    {
      title: t("plans.fields.taskName.label", "Task Name"),
      render: (_, record) => record.task_name,
      ellipsis: true,
    },
    {
      title: t("plans.fields.taskType.label", "Type"),
      render: (_, record) => record.task_type,
      width: 150,
    },
    {
      title: t("plans.fields.startDate.label", "Start Date"),
      dataIndex: "start_date",
      render: (date: string) => new Date(date).toLocaleString(),
      width: 180,
    },
    {
      title: t("plans.fields.endDate.label", "End Date"),
      dataIndex: "end_date",
      render: (date: string) => new Date(date).toLocaleString(),
      width: 180,
    },
    {
      title: t("plans.fields.action.label", "Action"),
      key: "actions",
      fixed: "right",
      dataIndex: "actions",
      align: "center",
      width: 100,
      render: (_value, record) => (
        <TaskActions
          fertilizerSelectProps={fertilizerSelectProps}
          pesticideSelectProps={pesticideSelectProps}
          itemSelectProps={itemSelectProps}
          record={record}
          taskType={taskType}
          onSuccess={onDeleted}
        />
      ),
    },
  ];

  if (tasks.length === 0) {
    return <Empty description={t("plans.tasks.noTasks", "No tasks yet")} />;
  }

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={tasks}
      scroll={{ x: true }}
      pagination={{ pageSize: 5 }}
      locale={{ emptyText: t("plans.tasks.noTasks", "No tasks yet") }}
    />
  );
};
