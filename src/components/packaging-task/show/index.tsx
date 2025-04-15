import { DateField, TagField, TextField, Title } from "@refinedev/antd";
import {
  useShow,
  useNavigation,
  useBack,
  useList,
  useOne,
  useUpdate,
  useGetIdentity,
} from "@refinedev/core";
import {
  Drawer,
  Flex,
  Grid,
  Typography,
  List,
  Divider,
  Image,
  Table,
  Radio,
  Space,
  Button,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { StatusTag } from "../../caring-task/status-tag";
import ChangeAssignedTasksModal, { HistoryAssignedModal } from "@/components/caring-task/show";
import useToken from "antd/es/theme/useToken";
import { IIdentity } from "@/interfaces";
type PackagingTaskShowProps = {
  visible?: boolean;
  onClose?: () => void;
  taskId?: number;
  refetch?: () => void;
};
export const PackagingTaskShow = (props: PackagingTaskShowProps) => {
  const { taskId, id } = useParams();
  const {
    data: queryResult,
    isLoading: packagingLoading,
    refetch: packagingRefetch,
    isFetching: packagingFetching,
  } = useOne<any>({
    resource: "packaging-tasks",
    id: taskId ?? props?.taskId,
    queryOptions: {
      enabled: props?.visible === true,
    },
  });
  const {
    data: packagingTypeData,
    isLoading: packagingTypeLoading,
    refetch: packagingTypeRefetch,
  } = useList({
    resource: "packaging-types",
    queryOptions: {
      enabled: props?.visible === true,
    },
  });
  const packagingTypes = packagingTypeData?.data || [];
  const back = useBack();
  const breakpoint = { sm: window.innerWidth > 576 };
  const task = queryResult?.data?.[0];
  const { data: historyAssignedData, refetch: historyAssignRefetch } = useList({
    resource: `packaging-tasks/${taskId ?? props?.taskId}/assigned-farmers`,
    queryOptions: {
      enabled: props?.visible === true,
    },
  });
  const [assignedModal, setAssignedModal] = useState(false);
  const { data: chosenFarmersData, refetch: chosenFarmerRefetch } = useList({
    resource: `plans/${id}/farmers`,
    queryOptions: {
      enabled: props?.visible === true,
    },
  });
  const chosenFarmers = chosenFarmersData?.data || [];
  const [visible, setVisible] = useState(false);
  const historyAssignedFarmers = historyAssignedData?.data || [];
  const columns = [
    { title: "ID", dataIndex: "item_id", key: "id" },
    { title: "Tên", dataIndex: "item_name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn vị", dataIndex: "unit", key: "unit" },
  ];
  const { token } = theme.useToken();
  const navigate = useNavigate();
  useEffect(() => {
    if (props?.visible === true) {
      packagingRefetch();
      chosenFarmerRefetch();
      historyAssignRefetch();
      packagingTypeRefetch();
    } else {
      setAssignedModal(false);
      setVisible(false);
    }
  }, [props?.visible]);
  const { data: user } = useGetIdentity<IIdentity>();
  const { mutate } = useUpdate({
    resource: "packaging-tasks",
    id: task?.id,
    mutationOptions: {
      onSuccess: () => {
        packagingRefetch();
      },
    },
  });

  const handleChangeStatus = (type: string) => {
    mutate({
      id: task?.id,
      values: {
        packaging_type_id: task?.packaging_type_id,
        task_name: task?.task_name,
        description: task?.description,
        start_date: task?.start_date,
        end_date: task?.end_date,
        updated_by: user?.name,
        status: type,
        items: task?.items,
      },
    });
  };
  return (
    <Drawer
      loading={packagingLoading || packagingFetching}
      open={props?.visible}
      width={breakpoint.sm ? "60%" : "100%"}
      onClose={props?.onClose ?? back}
      style={{ background: token.colorBgLayout }}
      headerStyle={{
        background: token.colorBgContainer,
      }}
      title={
        <>
          {task?.status === "Ongoing" && (
            <Flex justify="end">
              <Space>
                <Button onClick={() => handleChangeStatus("Cancel")} color="danger" variant="solid">
                  Hủy bỏ
                </Button>
              </Space>
            </Flex>
          )}
          {task?.status === "Pending" && (
            <Flex justify="end">
              <Space>
                <Button onClick={() => handleChangeStatus("Cancel")} color="danger" variant="solid">
                  Không chấp nhận
                </Button>
                <Button
                  onClick={() => handleChangeStatus("Ongoing")}
                  color="primary"
                  variant="solid"
                >
                  Tiến hành
                </Button>
              </Space>
            </Flex>
          )}
        </>
      }
    >
      <Flex vertical gap={24} style={{ padding: "32px" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          <strong>#{task?.id}</strong> - {task?.task_name}
        </Typography.Title>

        <Divider />
        <Typography.Title level={4}>Kết quả</Typography.Title>
        {task?.status === "Complete" ? (
          <Flex vertical gap={16}>
            {task.images?.length > 0 && (
              <Image.PreviewGroup items={task?.images || []}>
                <Image
                  loading="lazy"
                  style={{ borderRadius: "10px" }}
                  src={task?.packaging_images?.[0]}
                />
              </Image.PreviewGroup>
            )}
            <List
              style={{ backgroundColor: token.colorBgContainer }}
              bordered
              dataSource={[
                {
                  label: "Ngày hoàn thành",
                  value: <DateField format={"hh:mm DD/MM/YYYY"} value={task?.complete_date} />,
                },
                {
                  label: "Số lượng đóng gói",
                  value: <Typography.Text>{task?.packed_quantity}</Typography.Text>,
                },
                {
                  label: "Nội dung",
                  value: <Typography.Paragraph>{task?.result_content}</Typography.Paragraph>,
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
                </List.Item>
              )}
            />
          </Flex>
        ) : (
          <Typography.Text type="secondary">Không có kết quả.</Typography.Text>
        )}

        <Divider />
        <Flex justify="space-between" align="center">
          <Typography.Title level={4}>Chi tiết công việc</Typography.Title>
          {(task?.status === "Ongoing" ||
            task?.status === "Pending" ||
            task?.status === "Draft") && (
            <Button color="primary" variant="solid" onClick={() => navigate("edit")}>
              Thay đổi
            </Button>
          )}
        </Flex>
        <List
          style={{ backgroundColor: token.colorBgContainer }}
          bordered
          dataSource={[
            {
              label: "Ngày bắt đầu",
              value: <DateField format={"hh:mm DD/MM/YYYY"} value={task?.start_date} />,
            },
            {
              label: "Ngày kết thúc",
              value: <DateField format={"hh:mm DD/MM/YYYY"} value={task?.end_date} />,
            },
            {
              label: "Trạng thái",
              value: <StatusTag status={task?.status} />,
            },
            {
              label: "Nông dân thực hiện",
              value: task?.farmer_information?.[0]?.farmer_name,
            },
            { label: "Kế hoạch", value: task?.plan_name },
            {
              label: "Mô tả công việc",
              value: <Typography.Paragraph>{task?.description}</Typography.Paragraph>,
            },
            {
              label: "Loại đóng gói",
              value: task?.packaging_type_id
                ? packagingTypes?.find((x) => x.id === task?.packaging_type_id)?.name
                : "Chưa xác định",
            },
            {
              label: "Ngày tạo",
              value: <DateField format={"hh:mm DD/MM/YYYY"} value={task?.created_at} />,
            },
            {
              label: "Câp nhật lần cuối",
              value: task?.updated_at ? (
                <DateField format={"hh:mm DD/MM/YYYY"} value={task?.updated_at} />
              ) : (
                "Chưa cập nhập lần nào"
              ),
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
            </List.Item>
          )}
        />
        <List
          style={{ backgroundColor: token.colorBgContainer }}
          bordered
          dataSource={[
            {
              label: "Ngày tạo",
              value: <DateField format={"hh:mm DD/MM/YYYY"} value={task?.created_at} />,
            },
            {
              label: "Người tạo",
              value: <TextField value={task?.created_by} />,
            },
            {
              label: "Câp nhật lần cuối",
              value: task?.updated_at ? (
                <DateField format={"hh:mm DD/MM/YYYY"} value={task?.updated_at} />
              ) : (
                "Chưa cập nhập lần nào"
              ),
            },
            {
              label: "Người cập nhập cuối",
              value: <TextField value={task?.updated_by} />,
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
            </List.Item>
          )}
        />
        <Divider />
        <Flex justify="space-between" gap={5}>
          <Typography.Title level={4}>Người thực hiện</Typography.Title>
          <Space>
            {" "}
            <Button type="default" onClick={() => setVisible(true)}>
              Lịch sử
            </Button>
            {(task?.status === "Ongoing" ||
              task?.status === "Pending" ||
              task?.status === "Draft") && (
              <Button type="primary" color="cyan" onClick={() => setAssignedModal(true)}>
                Thay đổi
              </Button>
            )}
          </Space>
        </Flex>
        <List
          style={{ backgroundColor: token.colorBgContainer }}
          bordered
          dataSource={[
            {
              label: "Id",
              value: <TextField value={task?.farmer_id || "Chưa giao việc"} />,
            },
            {
              label: "Tên nông dân",
              value: (
                <TextField
                  value={
                    task?.farmer_id
                      ? task?.farmer_information?.find((x: any) => x?.farmer_id === task?.farmer_id)
                          ?.farmer_name
                      : "Chưa giao việc"
                  }
                />
              ),
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
            </List.Item>
          )}
        />
        <Divider />
        <Typography.Title level={4}>Vật tư</Typography.Title>
        <Table
          style={{ backgroundColor: token.colorBgContainer }}
          pagination={{ pageSize: 5 }}
          bordered
          columns={columns}
          dataSource={task?.packaging_items as any[]}
        ></Table>
      </Flex>
      <HistoryAssignedModal
        visible={visible}
        onClose={() => setVisible(false)}
        data={historyAssignedFarmers}
      />
      <ChangeAssignedTasksModal
        historyAssignedFarmers={(historyAssignedFarmers as []) ?? []}
        chosenFarmers={(chosenFarmers as []) ?? []}
        taskId={task?.id}
        refetch={packagingRefetch}
        end_date={task?.end_date}
        start_date={task?.start_date}
        type="packaging-tasks"
        onClose={() => setAssignedModal(false)}
        visible={assignedModal}
        assignedFarmers={chosenFarmers.find((x) => x.id === task?.farmer_id)}
      />
    </Drawer>
  );
};
