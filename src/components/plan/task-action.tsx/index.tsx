import { useTranslate } from "@refinedev/core";
import { EditOutlined, MoreOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Space } from "antd";
import { DeleteButton } from "@refinedev/antd";
import { useState } from "react";
import { TaskFormModal } from "../task-form-modal";

type TaskActionProps = {
  record: any;
  taskType: string;
  onSuccess?: () => void;
  fertilizerSelectProps?: any;
  pesticideSelectProps?: any;
  itemSelectProps?: any;
};

export const TaskActions: React.FC<TaskActionProps> = ({
  record,
  taskType,
  onSuccess,
  fertilizerSelectProps,
  pesticideSelectProps,
  itemSelectProps,
}) => {
  const t = useTranslate();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const getResource = () => {
    switch (taskType) {
      case "caring":
        return "caring-tasks";
      case "harvesting":
        return "harvesting-tasks";
      case "packaging":
        return "packaging-tasks";
      case "inspecting":
        return "inspecting-forms";
      default:
        throw new Error(t("errors.unknownTaskType", "Unknown task type"));
    }
  };

  const showEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
  };

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: t("buttons.edit", "Edit"),
      icon: <EditOutlined />,
      onClick: showEditModal,
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: (
        <DeleteButton
          type="text"
          size="small"
          recordItemId={record.id}
          resource={getResource()}
          onSuccess={() => {
            if (onSuccess) onSuccess();
          }}
          confirmTitle={t("confirm.deleteTask", "Delete Task")}
          confirmOkText={t("buttons.yes", "Yes")}
          confirmCancelText={t("buttons.cancel", "Cancel")}
        />
      ),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <MoreOutlined />
          </Space>
        </a>
      </Dropdown>

      {isEditModalVisible && (
        <TaskFormModal
          taskType={taskType}
          planId={record.plan_id}
          initialValues={record}
          visible={isEditModalVisible}
          onCancel={handleEditModalClose}
          fertilizerSelectProps={fertilizerSelectProps}
          pesticideSelectProps={pesticideSelectProps}
          itemSelectProps={itemSelectProps}
          onSuccess={() => {
            handleEditModalClose();
            if (onSuccess) onSuccess();
          }}
        />
      )}
    </>
  );
};
