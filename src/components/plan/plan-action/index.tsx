import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { EditOutlined, MoreOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Space } from "antd";
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
  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: (
        <EditButton
          key="edit"
          size="small"
          type="text"
          onClick={() => {
            return go({
              to: `${editUrl("plans", record.id)}`,
              query: {
                to: pathname,
              },
              options: {
                keepQuery: true,
              },
              type: "replace",
            });
          }}
        >
          {t("actions.edit")}
        </EditButton>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: (
        <DeleteButton
          key="delete"
          type="text"
          size="small"
          recordItemId={record.id}
          resource="plans"
          onSuccess={() => {
            if (onSuccess) {
              onSuccess();
            }
          }}
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
    </>
  );
};
