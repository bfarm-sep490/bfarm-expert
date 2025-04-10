import { useParams } from "react-router";
import { CaringTaskPage } from "../../../components/caring-task/drawer-form";
import { Button, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useBack } from "@refinedev/core";

export const CaringCreate = () => {
  const back = useBack();
  return (
    <>
      {" "}
      <Button type="text" onClick={back} style={{ width: "40px", height: "40px" }}>
        <ArrowLeftOutlined style={{ fontSize: "20px" }} />
      </Button>
      <Card
        title={"Thêm công việc chăm sóc"}
        style={{ width: "100%", margin: "0 auto", padding: "16px" }}
      >
        <CaringTaskPage action={"create"} />
      </Card>
    </>
  );
};
