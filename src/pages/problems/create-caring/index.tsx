import { useParams } from "react-router";
import { CaringTaskPage } from "../../../components/caring-task/drawer-form";
import { Button, Card, Modal } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { BaseKey, useBack } from "@refinedev/core";
type CaringCreateProps = {
  action?: string;
  planId?: number;
  problemId?: number;
  open?: boolean;
  taskId?: number;
  onClose?: () => void;
  onOpen?: () => void;
  refetch?: () => void;
};
export const CaringModal = (props: CaringCreateProps) => {
  return (
    <>
      {" "}
      <Modal
        title={props?.action === "create" ? "Thêm công việc" : "Cập nhập công việc"}
        open={props?.open}
        footer={null}
        width={"60%"}
        height={"60%"}
        onCancel={props?.onClose}
      >
        <CaringTaskPage
          taskId={props?.taskId as BaseKey}
          onClose={props?.onClose}
          planId={props?.planId}
          refetch={props?.refetch}
          problemId={props?.problemId}
          action={props?.taskId ? "edit" : "create"}
        />
      </Modal>
    </>
  );
};
