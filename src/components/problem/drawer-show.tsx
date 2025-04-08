import {
  DateField,
  TagField,
  TextField,
  Title,
  useModalForm,
} from "@refinedev/antd";
import {
  useShow,
  useNavigation,
  useBack,
  useUpdate,
  useTranslate,
  useGetIdentity,
  useApiUrl,
  useNotification,
  useCustomMutation,
  useList,
  useOne,
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
  Card,
  Form,
  Modal,
  Spin,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ReportProblemModal } from "./report-modals";
import { ProblemStatusTag } from "./status-tag";
import { CaringModal } from "@/pages/problems/create-caring";
import { StatusTag } from "../caring-task/status-tag";
import { CaringTypeTag } from "../caring-task/type-tag";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DiffOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { AssignTaskModal } from "../plan/assign-tasks-modal";

export const ProblemShowInProblem = () => {
  const { id } = useParams();
  const [isAbilityToReport, setIsAbilityToReport] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<number | undefined>(undefined);
  const [openAssignTasks, setOpenAssignTasks] = useState(false);
  const { token } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultReportStatus, setDefaultReportStatus] = useState("Resovle");
  const screens = Grid.useBreakpoint();
  const isLargeScreen = screens?.sm ?? false;
  const [open, setOpen] = useState(false);
  const back = useBack();
  const breakpoint = { sm: window.innerWidth > 576 };
  const {
    data: queryResult,
    refetch: problemRefetch,
    isLoading: problemLoading,
  } = useOne<any>({
    resource: "problems",
    id,
  });
  const {
    data: taskData,
    isLoading: taskLoading,
    refetch: tasksRefetch,
  } = useList({
    resource: "caring-tasks",
    filters: [{ field: "problem_id", operator: "eq", value: id }],
    queryOptions: {
      onSuccess(data) {
        if (data?.data !== null) {
          data?.data?.forEach((x) => {
            if (x?.farmer_id === null) {
              setIsAbilityToReport(true);
              return;
            }
          });
        }
      },
    },
  });

  const task = queryResult?.data;
  const tasks = taskData?.data;
  const columns = [
    {
      title: "Tên hoạt động",
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: "Loại công việc",
      dataIndex: "task_type",
      key: "task_type",
      render: (value: any) => <CaringTypeTag status={value} />,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (value: any) => <DateField format={"hh:mm DD/MM/YYYY"} value={value} />,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (value: any) => <DateField format={"hh:mm DD/MM/YYYY"} value={value} />,
    },
    {
      title: "Nông dân",
      dataIndex: "farmer_id",
      key: "farmer_name",
      render: (value: any, record: any) => (
        <TextField
          value={
            record?.farmer_information?.find((x: any) => x.farmer_id === value)
              ?.farmer_name || "Chưa xác định"
          }
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",

      render: (value: any) => <StatusTag status={value} />,
    },
    {
      title: "Hoạt động",
      dataIndex: "actions",
      key: "actions",
      fixed: "right" as const,
      render: (value: any, record: any) => (
        <Flex gap={10}>
          {record?.status === "Pending" && <DeleteOutlined style={{ color: "red" }} />}
          {record?.status !== "Complete" && (
            <EditOutlined
              style={{ color: "green" }}
              onClick={() => {
                setTaskId(record?.id);
                setOpen(true);
              }}
            />
          )}
        </Flex>
      ),
    },
  ];

  return (
    <>
      <Drawer
        loading={problemLoading}
        open={true}
        width={isLargeScreen ? "60%" : "100%"}
        onClose={back}
        style={{ background: token.colorBgLayout }}
        headerStyle={{
          background: token.colorBgContainer,
        }}
        title={
          <>
            <Flex justify="space-between">
              <Typography.Title level={4}>
                Chi tiết vấn đề: {task?.problem_name}
              </Typography.Title>
              <Flex>
                {task?.status === "Pending" && (
                  <Space>
                    {" "}
                    <Button
                      color="danger"
                      variant="solid"
                      onClick={() => {
                        setDefaultReportStatus("Cancel");
                        setIsModalOpen(true);
                      }}
                      icon={<CloseCircleOutlined />}
                    >
                      Hủy bỏ
                    </Button>
                    <Button
                      disabled={isAbilityToReport}
                      color="primary"
                      variant="solid"
                      onClick={() => {
                        setDefaultReportStatus("Resolve");
                        setIsModalOpen(true);
                      }}
                      icon={<CheckCircleOutlined />}
                    >
                      Đồng ý
                    </Button>
                  </Space>
                )}
                {isAbilityToReport && (
                  <Typography.Text color="red" style={{ fontSize: 12 }}>
                    Có công việc chưa được phân công. Vui lòng kiểm tra lại
                  </Typography.Text>
                )}
              </Flex>
            </Flex>
          </>
        }
      >
        <CaringModal
          refetch={tasksRefetch}
          planId={task?.plan_id}
          problemId={task?.id}
          open={open}
          taskId={taskId}
          onClose={() => setOpen(false)}
        />
        <AssignTaskModal
          open={openAssignTasks}
          onClose={() => setOpenAssignTasks(false)}
          planId={task?.plan_id}
          problemId={task?.id}
          refetch={tasksRefetch}
          type="Draft"
        />
        <Flex vertical gap={24} style={{ padding: "32px" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Hình ảnh
          </Typography.Title>
          {task?.problem_images?.length > 0 ? (
            <Image.PreviewGroup items={task?.problem_images?.map((x: any) => x?.url) || []}>
              <Flex vertical={false} gap={16} justify="center">
                <Image
                  width={"60%"}
                  height={"60%"}
                  loading="lazy"
                  style={{ borderRadius: "10px" }}
                  src={task?.problem_images?.[0]?.url}
                />
              </Flex>
            </Image.PreviewGroup>
          ) : (
            <Typography.Text type="secondary">Không có hình ảnh.</Typography.Text>
          )}
          <Divider />
          {task?.status !== "Pending" && (
            <>
              <Typography.Title level={4}>Kết quả</Typography.Title>
              {task?.result_content ? (
                <Flex vertical gap={16}>
                  <List
                    style={{ backgroundColor: token.colorBgContainer }}
                    bordered
                    dataSource={[
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
                <Typography.Text type="secondary">
                  Chưa có kết quả.
                </Typography.Text>
              )}
              <Divider />
            </>
          )}
          <Typography.Title level={4}>Nội dung</Typography.Title>
          <List
            style={{ backgroundColor: token.colorBgContainer }}
            bordered
            dataSource={[
              {
                label: "Nông dân",
                value: <TextField value={task?.farmer_name} />,
              },
              {
                label: "Kế hoạch",
                value: <TextField value={task?.plan_name} />,
              },
              {
                label: "Ngày phát hiện",
                value: (
                  <DateField
                    format={"hh:mm DD/MM/YYYY"}
                    value={task?.created_date}
                  />
                ),
              },

              {
                label: "Trạng thái",
                value: <ProblemStatusTag status={task?.status} />,
              },
              {
                label: "Mô tả vấn đề",
                value: (
                  <Typography.Paragraph>
                    {task?.description}
                  </Typography.Paragraph>
                ),
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text strong>{item.label}:</Typography.Text>{" "}
                {item.value}
              </List.Item>
            )}
          />
          <Divider />
          <Typography.Title level={4}>Hoạt động</Typography.Title>
          <Card
            style={{ borderRadius: "10px" }}
            title={
              <>
                <Flex vertical={false} gap={16} justify="space-between">
                  <Typography.Title level={5}>Danh sách hoạt động</Typography.Title>
                </Flex>
              </>
            }
          >
            {task?.status === "Pending" && (
              <Flex gap={4} justify="end">
                <Button
                  icon={<DiffOutlined />}
                  onClick={() => {
                    setOpenAssignTasks(true);
                  }}
                >
                  Phân việc
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setTaskId(undefined);
                    setOpen(true);
                  }}
                  icon={<PlusCircleOutlined />}
                >
                  Thêm
                </Button>
              </Flex>
            )}
            <Table
              style={{ marginTop: 8 }}
              loading={taskLoading}
              columns={columns}
              dataSource={tasks}
              scroll={{ x: "max-content" }}
            ></Table>
          </Card>
          <ReportProblemModal
            refetch={() => {
              tasksRefetch();
              problemRefetch();
            }}
            close={() => {
              setIsModalOpen(false);
            }}
            open={isModalOpen}
            status={defaultReportStatus}
          />
        </Flex>{" "}
      </Drawer>
    </>
  );
};
