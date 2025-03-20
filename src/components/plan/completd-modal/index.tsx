import { useEffect } from "react";
import { useModalForm } from "@refinedev/antd";
import { Modal, Form, Button, Typography } from "antd";

type Props = {
  visible: boolean;
  id: number;
  onClose: () => void;
  status: string;
};

export const StatusModal = ({ id, visible, onClose, status }: Props) => {
  const { formProps, modalProps } = useModalForm<{ status: string }>({
    action: "edit",
    resource: "plans",
    id: `${id}/status`,
    redirect: "show",
    queryOptions: {
      enabled: false,
    }
  });

  const getMessage = () => {
    switch (status) {
      case "complete":
        return "Bạn chắc chắn muốn hoàn thành kế hoạch?";
      case "cancel":
        return "Bạn chắc chắn muốn hủy kế hoạch?";
    }
  };

  useEffect(() => {
    if (formProps.form) {
      formProps.form.setFieldsValue({ status });
    }
  }, [formProps.form]);

  return (
    <Modal
      {...modalProps}
      title="Xác nhận hoàn thành"
      open={visible}
      onCancel={onClose}
      width={"20%"}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy bỏ
        </Button>,
        <Button key="submit" type="primary" onClick={formProps.form?.submit}>
          Xác nhận
        </Button>,
      ]}
    >
      <Typography.Text>{getMessage()}</Typography.Text>
      <br />
      <Typography.Text style={{ color: "red", fontSize: 11, fontStyle: "italic" }}>
        *Chú ý: Hành động này không thể hoàn tác
      </Typography.Text>
      <Form {...formProps} layout="vertical">
        <Form.Item name="status" hidden>
          <input type="hidden" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
