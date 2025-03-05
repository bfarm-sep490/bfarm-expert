import { useTranslate, useDelete } from "@refinedev/core";
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Space } from "antd";
import { DeleteButton } from "@refinedev/antd"; // Import DeleteButton
import { useState } from "react";
import { TaskFormModal } from "../task-form-modal";

type TaskActionProps = {
  record: any;
  taskType: string;
  onSuccess?: () => void;
};

export const TaskActions: React.FC<TaskActionProps> = ({ record, taskType, onSuccess }) => {
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

  // Hiển thị modal chỉnh sửa
  const showEditModal = () => {
    setIsEditModalVisible(true);
  };

  // Đóng modal chỉnh sửa
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
          onSuccess={() => {
            handleEditModalClose();
            if (onSuccess) onSuccess();
          }}
        />
      )}
    </>
  );
};
