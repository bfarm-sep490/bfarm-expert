import { DateField, SaveButton, TextField, useForm } from "@refinedev/antd";
import { type BaseKey, useApiUrl, useBack, useGo, useList, useTranslate } from "@refinedev/core";
import {
  Form,
  Input,
  Select,
  Button,
  Spin,
  DatePicker,
  Card,
  Flex,
  Row,
  Col,
  Divider,
  Table,
} from "antd";
import { useParams, useSearchParams } from "react-router";
import dayjs from "dayjs";
import Typography from "antd/es/typography/Typography";
import { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
type Props = {
  taskId?: BaseKey;
  action: "edit" | "create";
  onMutationSuccess?: () => void;
};
interface ICaringTask {
  id: number;
  plan_id: number;
  farmer_id: number;
  problem_id: number;
  task_name: string;
  result_content: string;
  task_type: string;
  start_date: Date;
  end_date: Date;
  priority: number;
  status: string;
  complete_date: Date;
  created_at: Date;
  updated_at: Date;
  care_images: string[];
  care_pesticides: {
    pesticide_id: number;
    pesticide_quantity: number;
    pesticide_unit: string;
  };
  care_fertilizers: {
    fertilizer_id: number;
    fertilizer_quantity: number;
    fertilizer_unit: string;
  };
  care_items: {
    item_id: number;
    item_quantity: number;
    item_unit: string;
  };
}
export const CaringTaskPage = (props: Props) => {
  const back = useBack();
  const [searchParams] = useSearchParams();
  const [chosenFertilizers, setChosenFertilizer] = useState<
    {
      fertilizer_id: number;
      fertilizer_quantity: number;
      fertilizer_unit: string;
    }[]
  >();
  const [chosenPesticides, setChosenPesticides] = useState<
    {
      pesticide_id: number;
      pesticide_quantity: number;
      pesticide_unit: string;
    }[]
  >();

  const [chosenItems, setChosenItems] = useState<
    {
      item_id: number;
      item_quantity: number;
      item_unit: string;
    }[]
  >();
  const go = useGo();
  const t = useTranslate();
  const queryPlans = useList({ resource: "plans" });
  const plans = queryPlans.data?.data;

  const queryProblems = useList({ resource: "problems" });
  const problems = queryProblems.data?.data;

  const queryFarmers = useList({ resource: "farmers" });
  const farmers = queryFarmers.data?.data;

  const queryFerilizers = useList({ resource: "fertilizers" });
  const fertilizers = queryFerilizers.data?.data;
  const fertilizer_columns = [
    {
      title: "Tên phân bón",
      dataIndex: "fertilizer_id",
      key: "fertilizer_id",
      render: (value: any) => (
        <TextField value={fertilizers?.find((x) => x.id === value)?.name || "Không xác định"} />
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "fertilizer_quantity",
      key: "fertilizer_quantity",
      render: (text: any, record: any) => (
        <Input
          type="number"
          value={record?.fertilizer_quantity}
          onChange={(e) => {
            const newFertilizers = chosenFertilizers?.map((x) =>
              x.fertilizer_id === record.fertilizer_id
                ? {
                    ...x,
                    fertilizer_quantity: e.target.value as unknown as number,
                  }
                : x,
            );
            if (newFertilizers) setChosenFertilizer(newFertilizers);
          }}
        />
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "fertilizer_unit",
      key: "fertilizer_unit",
      render: (text: any, record: any) => (
        <Select
          defaultValue={record?.fertilizer_unit || "kg"}
          onChange={(value) => {
            const newFertilizers = chosenFertilizers?.map((x) =>
              x.fertilizer_id === record.fertilizer_id ? { ...x, fertilizer_unit: value } : x,
            );
            if (newFertilizers) setChosenFertilizer(newFertilizers);
          }}
        >
          <Select.Option key="kg" value="kg">
            Kg
          </Select.Option>
          <Select.Option key="ton" value="ton">
            Tấn
          </Select.Option>
        </Select>
      ),
    },
  ];

  const queryPesticides = useList({ resource: "pesticides" });
  const pesticides = queryPesticides.data?.data;

  const queryItems = useList({ resource: "items" });
  const items = queryItems.data?.data;

  const { formProps, formLoading } = useForm<ICaringTask>({
    id: props?.taskId,
    action: props.action,
    resource: "caring-tasks",
    redirect: false,
    onMutationSuccess: () => {
      props.onMutationSuccess?.();
    },
  });

  const title =
    props?.action === "edit" ? "Chỉnh sửa công việc chăm sóc" : "Thêm công việc chăm sóc";

  const statusOptions = [
    { label: t("status.pending", "Chờ xử lý"), value: "Pending" },
    { label: t("status.ongoing", "Đang thực hiện"), value: "Ongoing" },
    { label: t("status.completed", "Hoàn thành"), value: "Completed" },
  ];
  const handleFertilizerChange = (value: any) => {
    const existingFertilizer = chosenFertilizers?.find((x) => x.fertilizer_id === value);

    if (!existingFertilizer) {
      setChosenFertilizer(
        [
          {
            fertilizer_id: value as number,
            fertilizer_quantity: 0,
            fertilizer_unit: "kg",
          },
        ].concat(chosenFertilizers as any),
      );
    }
  };
  return (
    <>
      <Button type="text" style={{ width: "40px", height: "40px" }} onClick={back}>
        <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
      </Button>
      <Card title={title} style={{ width: "100%", margin: "0 auto", padding: "16px" }}>
        <Spin spinning={formLoading}>
          <Form {...formProps} layout="vertical">
            <Form.Item label="Tên công việc" name="task_name" rules={[{ required: true }]}>
              {" "}
              <Input />{" "}
            </Form.Item>
            <Form.Item label="Loại công việc" name="task_type" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Watering">Tưới nước</Select.Option>
                <Select.Option value="Planting">Gieo trồng</Select.Option>
                <Select.Option value="Fertilizering">Bón phân</Select.Option>
                <Select.Option value="Pesticiding">Phun thuốc</Select.Option>
              </Select>
            </Form.Item>
            <Flex gap={"10px"}>
              <Form.Item
                label="Ngày bắt đầu dự kiến"
                name="start_date"
                rules={[{ required: true }]}
              >
                {" "}
                <DatePicker format="DD-MM-YYYY" />{" "}
              </Form.Item>
              <Form.Item label="Ngày kết thúc dự kiến" name="end_date" rules={[{ required: true }]}>
                {" "}
                <DatePicker format="DD-MM-YYYY" />{" "}
              </Form.Item>
            </Flex>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Vấn đề liên quan" name="problem_id">
                  <Select style={{ width: "100%" }}>
                    {problems?.map((x) => (
                      <Select.Option key={x.id} value={x.id}>
                        <Typography style={{ color: "gray" }}>#{x.id}</Typography> {x.problem_name}
                      </Select.Option>
                    ))}
                    <Select.Option value={null}>Khác</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Kế hoạch liên quan" name="plan_id">
                  <Select style={{ width: "100%" }}>
                    {plans?.map((x) => (
                      <Select.Option key={x.id} value={x.id}>
                        <Typography style={{ color: "gray" }}>#{x.id}</Typography> {x.plan_name}
                      </Select.Option>
                    ))}
                    <Select.Option value={null}>Khác</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Nông dân thực hiện" name="farmer_id">
              <Select>
                {farmers?.map((x) => (
                  <Select.Option key={x.id} value={x.id}>
                    <Typography style={{ color: "gray" }}>#{x.id}</Typography> {x.name}
                  </Select.Option>
                ))}
                <Select.Option value={null}>Khác</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
              {" "}
              <Select options={statusOptions} />{" "}
            </Form.Item>
            <Form.Item label="Mô tả" name="description" rules={[{ required: true }]}>
              {" "}
              <Input.TextArea rows={7} />{" "}
            </Form.Item>

            {/* <Divider />
          <Form.Item label="Chọn phân bón" name="fertilizers">
            <Select
              mode="multiple"
              onChange={handleFertilizerChange}
              style={{ width: "100%" }}
            >
              {fertilizers?.map((x) => (
                <Select.Option key={x.id} value={x.id}>
                  <Typography style={{ color: "gray" }}>#{x.id}</Typography>{" "}
                  {x.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Table
            pagination={false}
            columns={fertilizer_columns}
            dataSource={chosenFertilizers}
            rowKey="fertilizer_id"
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={() => go({ to: "/caring-tasks" })}>Hủy</Button>
            <SaveButton htmlType="submit" type="primary">
              Lưu
            </SaveButton>
          </div> */}
          </Form>
        </Spin>
      </Card>
    </>
  );
};

export default CaringTaskPage;
