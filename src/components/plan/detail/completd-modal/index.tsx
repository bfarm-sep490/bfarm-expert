import { useEffect } from "react";
import { useModalForm } from "@refinedev/antd";
import { Modal, Form, Button, Typography } from "antd";
import { useNavigate } from "react-router";
import {
  useBack,
  useCustomMutation,
  useDelete,
  useGetIdentity,
  useUpdate,
} from "@refinedev/core";
import { IIdentity } from "@/interfaces";

type Props = {
  visible: boolean;
  id: number;
  onClose: () => void;
  status: string;
  refetch?: () => void;
};

export const StatusModal = ({ id, visible, onClose, status, refetch }: Props) => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IIdentity>();
  const { isLoading, mutate } = useUpdate();
  const { isLoading: deletedLoading, mutate: deletedMutate } = useDelete();
  const getMessage = () => {
    switch (status) {
      case "complete":
        return "Bạn chắc chắn muốn hoàn thành kế hoạch?";
      case "cancel":
        return "Bạn chắc chắn muốn hủy kế hoạch?";
      default:
        return "";
    }
  };
  const back = useBack();
  const updateItem = async () => {
    try {
      if (status !== "Cancel")
        mutate(
          {
            resource: "plans",
            id: `${id}/plan-public`,
            values: {
              report_by: user?.name,
            },
          },
          {
            onSuccess: () => {
              refetch?.();
              onClose?.();
            },
          },
        );
      else {
        deletedMutate(
          {
            resource: "plans",
            id: `${id}`,
            values: {},
          },
          {
            onSuccess: () => {
              back();
            },
          }
        );
      }
    } catch (error) {
      console.error("Error during status update:", error);
    }
  };

  return (
    <Modal
      title="Xác nhận hoàn thành"
      open={visible}
      onCancel={onClose}
      width={"20%"}
      footer={[
        <Button key="cancel" loading={isLoading} onClick={onClose}>
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={updateItem}
          loading={isLoading}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <Typography.Text>{getMessage()}</Typography.Text>
      <br />
      <Typography.Text
        style={{ color: "red", fontSize: 11, fontStyle: "italic" }}
      >
        *Chú ý: Hành động này không thể hoàn tác
      </Typography.Text>
    </Modal>
  );
};
