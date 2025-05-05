import { useGo, useNavigation, useTranslate, useCustomMutation, useApiUrl } from "@refinedev/core";
import { SettingOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Space, message, Button } from "antd";
import { DeleteButton, EditButton } from "@refinedev/antd";
import { IPlan } from "@/interfaces";
import { useLocation } from "react-router";

type PlanActionProps = {
  record: IPlan;
  onSuccess?: () => void;
};

export const PlanActions: React.FC<PlanActionProps> = ({ record, onSuccess }) => {
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { editUrl } = useNavigation();
  const apiUrl = useApiUrl();

  const { mutate: updateStatus } = useCustomMutation();

  const handleStatusChange = async (newStatus: string) => {
    try {
      updateStatus(
        {
          url: `${apiUrl}/plans/${record.id}/status?status=${newStatus}&report_by=Expert`,
          method: "put",
          values: {},
        },
        {
          onSuccess: () => {
            message.success(t("plans.messages.statusUpdateSuccess", "Status updated successfully"));
            if (onSuccess) {
              onSuccess();
            }
          },
          onError: () => {
            message.error(t("plans.messages.statusUpdateError", "Failed to update status"));
          },
        },
      );
    } catch (error) {
      console.error("Status update error:", error);
      message.error(t("plans.messages.statusUpdateError", "Failed to update status"));
    }
  };

  const items: MenuProps["items"] = [
    ...(record.status !== "Ongoing"
      ? [
          {
            key: "delete",
            label: (
              <DeleteButton
                key="delete"
                type="text"
                size="small"
                recordItemId={record.id}
                resource="plans"
                style={{ width: "100%", textAlign: "left", padding: "4px 8px" }}
                onSuccess={() => {
                  if (onSuccess) {
                    onSuccess();
                  }
                }}
              />
            ),
          },
        ]
      : []),
  ];

  if (record.status === "Draft" || record.status === "Pending") {
    items.push(
      {
        type: "divider",
      },
      {
        key: "changeStatus",
        label: (
          <Button
            type="text"
            size="small"
            style={{ width: "100%", textAlign: "left", padding: "4px 8px" }}
            onClick={() => handleStatusChange(record.status === "Draft" ? "Pending" : "Draft")}
          >
            {record.status === "Draft" ? t("actions.approval") : t("actions.draft")}
          </Button>
        ),
      },
    );
  }

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button
          type="text"
          icon={<SettingOutlined style={{ fontSize: "16px" }} />}
          onClick={(e) => e.preventDefault()}
        />
      </Dropdown>
    </>
  );
};
