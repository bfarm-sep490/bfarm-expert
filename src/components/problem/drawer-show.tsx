import { DateField, TextField } from "@refinedev/antd";
import { useBack, useList, useOne, useDelete, useGo } from "@refinedev/core";
import {
  Drawer,
  Flex,
  Grid,
  Typography,
  List,
  Image,
  Table,
  Button,
  theme,
  Card,
  notification,
  Tag,
  Tooltip,
  Popconfirm,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ReportProblemModal } from "./report-modals";
import { ProblemStatusTag } from "./status-tag";
import { StatusTag } from "../caring-task/status-tag";
import { CaringTypeTag } from "../caring-task/type-tag";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DiffOutlined,
  EditOutlined,
  PlusCircleOutlined,
  InfoCircleOutlined,
  FileImageOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { AssignTaskModal } from "../plan/detail/assign-tasks-modal";
import TaskModal from "../task-create-update";

type ProblemShowInProblemProps = {
  problemId?: number;
  open?: boolean;
  onClose?: () => void;
  refetch?: () => void;
};

export const ProblemShowInProblem = (props: ProblemShowInProblemProps) => {
  const { id } = useParams();
  const [isAbilityToReport, setIsAbilityToReport] = useState<boolean>(true);
  const [taskId, setTaskId] = useState<number | undefined>(undefined);
  const [openAssignTasks, setOpenAssignTasks] = useState(false);
  const { token } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultReportStatus, setDefaultReportStatus] = useState("Resovle");
  const [selectTaskId, setSelectTaskId] = useState<number | undefined>(undefined);
  const [methodTask, setMethodTask] = useState<"create" | "edit">("create");
  const screens = Grid.useBreakpoint();
  const isLargeScreen = screens?.sm ?? false;
  const [open, setOpen] = useState(false);
  const back = useBack();
  const [api, contextHolder] = notification.useNotification();
  const go = useGo();
  const {
    data: queryResult,
    refetch: problemRefetch,
    isLoading: problemLoading,
  } = useOne<any>({
    resource: "problems",
    id: props?.problemId ?? id,
    queryOptions: {
      enabled: !!(props?.open ?? id),
    },
  });
  const {
    data: taskData,
    isLoading: taskLoading,
    refetch: tasksRefetch,
  } = useList({
    resource: "caring-tasks",
    filters: [
      {
        field: "problem_id",
        operator: "eq",
        value: props?.problemId ? props?.problemId : id,
      },
    ],
    queryOptions: {
      enabled: !!(props?.open ?? id),
      onSuccess(data) {
        if (data?.data !== null) {
          data?.data?.forEach((x) => {
            if (x?.farmer_id === null) {
              setIsAbilityToReport(false);
              return;
            }
          });
        }
      },
    },
  });
  useEffect(() => {
    if (taskData?.data) {
      setIsAbilityToReport(true);
      taskData?.data?.forEach((x) => {
        if (x?.farmer_id === null) {
          setIsAbilityToReport(false);
          return;
        }
      });
    }
  }, [taskData]);
  const task = queryResult?.data;
  const tasks = taskData?.data;
  const { mutate } = useDelete();

  const hanldeDeleteTask = (taskId: number) => {
    mutate(
      {
        resource: "caring-tasks",
        id: taskId,
      },
      {
        onSuccess: (data) => {
          if (data?.data !== null) {
            api.error({
              message: "Lỗi vui lòng thử lại",
              description: data?.data as unknown as string,
            });
            return;
          }
          tasksRefetch();
          problemRefetch();
        },
        onError: (error) => {
          api.error({
            message: "Có lỗi xảy ra",
            description: error?.message || "Vui lòng thử lại sau",
            placement: "top",
          });
        },
      },
    );
  };

  const handlePlanClick = () => {
    if (task?.plan_id) {
      go({
        to: `/plans/${task.plan_id}`,
        type: "push",
      });
    }
  };

  const columns = [
    {
      title: "Tên hoạt động",
      dataIndex: "task_name",
      key: "task_name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Loại công việc",
      dataIndex: "task_type",
      key: "task_type",
      width: 120,
      render: (value: any) => <CaringTypeTag status={value} />,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      width: 150,
      render: (value: any) => <DateField format={"hh:mm DD/MM/YYYY"} value={value} />,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      width: 150,
      render: (value: any) => <DateField format={"hh:mm DD/MM/YYYY"} value={value} />,
    },
    {
      title: "Nông dân",
      dataIndex: "farmer_id",
      key: "farmer_name",
      width: 150,
      ellipsis: true,
      render: (value: any, record: any) => (
        <Tooltip
          title={
            record?.farmer_information?.find((x: any) => x.farmer_id === value)?.farmer_name ||
            "Chưa xác định"
          }
        >
          <TextField
            value={
              record?.farmer_information?.find((x: any) => x.farmer_id === value)?.farmer_name ||
              "Chưa xác định"
            }
          />
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: any) => <StatusTag status={value} />,
    },
    {
      title: "Hoạt động",
      dataIndex: "actions",
      key: "actions",
      width: 100,
      fixed: "right" as const,
      render: (value: any, record: any) => (
        <Flex gap={8}>
          {record?.status === "Draft" && (
            <Popconfirm
              title="Xóa hoạt động"
              description="Bạn có chắc chắn muốn xóa hoạt động này?"
              onConfirm={() => hanldeDeleteTask(record?.id)}
              okText="Có"
              cancelText="Không"
            >
              <Tooltip title="Xóa">
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
          {record?.status === "Draft" && (
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectTaskId(record?.id);
                  setMethodTask("edit");
                  setOpen(true);
                }}
              />
            </Tooltip>
          )}
        </Flex>
      ),
    },
  ];
  useEffect(() => {
    if (props?.open === true) {
      problemRefetch();
      tasksRefetch();
    } else {
      setIsAbilityToReport(true);
      setIsModalOpen(false);
      setOpen(false);
      setOpenAssignTasks(false);
      setTaskId(undefined);
      setDefaultReportStatus("Complete");
    }
  }, [props?.open]);
  return (
    <>
      <Drawer
        loading={problemLoading}
        open={props?.open ?? true}
        width={isLargeScreen ? "60%" : "100%"}
        onClose={props?.onClose ?? back}
        style={{ background: token.colorBgLayout }}
        title={
          <Flex vertical gap={8}>
            <Flex justify="space-between" align="center">
              <Typography.Title level={4} style={{ margin: 0 }}>
                {task?.problem_name}
              </Typography.Title>
              <ProblemStatusTag status={task?.status} />
            </Flex>
            <Flex gap={8} align="center" wrap>
              <Tooltip title={task?.farmer_name}>
                <Tag icon={<UserOutlined />} color="blue" style={{ maxWidth: 200 }}>
                  <Typography.Text ellipsis style={{ maxWidth: 150 }}>
                    {task?.farmer_name}
                  </Typography.Text>
                </Tag>
              </Tooltip>
              <Tooltip title={task?.plan_name}>
                <Tag
                  icon={<FileTextOutlined />}
                  color="green"
                  style={{ maxWidth: 200, cursor: "pointer" }}
                  onClick={handlePlanClick}
                >
                  <Typography.Text ellipsis style={{ maxWidth: 150 }}>
                    {task?.plan_name}
                  </Typography.Text>
                </Tag>
              </Tooltip>
              <Tag icon={<CalendarOutlined />} color="purple">
                <DateField format={"hh:mm DD/MM/YYYY"} value={task?.created_date} />
              </Tag>
            </Flex>
          </Flex>
        }
        footer={
          task?.status === "Pending" ? (
            <Flex justify="end" gap={8}>
              <Tooltip title="Hủy bỏ vấn đề">
                <Button
                  danger
                  onClick={() => {
                    setDefaultReportStatus("Cancel");
                    setIsModalOpen(true);
                  }}
                  icon={<CloseCircleOutlined />}
                >
                  Hủy bỏ
                </Button>
              </Tooltip>
              <Tooltip title="Giải quyết vấn đề">
                <Button
                  type="primary"
                  disabled={!isAbilityToReport}
                  onClick={() => {
                    setDefaultReportStatus("Resolve");
                    setIsModalOpen(true);
                  }}
                  icon={<CheckCircleOutlined />}
                >
                  Đồng ý
                </Button>
              </Tooltip>
            </Flex>
          ) : null
        }
      >
        {contextHolder}
        <TaskModal
          onClose={() => setOpen(false)}
          visible={open}
          action={methodTask}
          planId={task?.plan_id}
          status="Draft"
          taskType={"caring"}
          taskId={selectTaskId}
          problemId={task?.id}
          refetch={tasksRefetch}
        />
        <AssignTaskModal
          open={openAssignTasks}
          onClose={() => setOpenAssignTasks(false)}
          planId={task?.plan_id}
          problemId={task?.id}
          refetch={tasksRefetch}
          type="Draft"
        />
        <Flex vertical gap={24} style={{ padding: "24px" }}>
          <Card
            title={
              <Flex align="center" gap={8}>
                <FileImageOutlined />
                <Typography.Text strong>Hình ảnh</Typography.Text>
              </Flex>
            }
            style={{ borderRadius: "8px" }}
          >
            {task?.problem_images?.length > 0 ? (
              <Image.PreviewGroup items={task?.problem_images?.map((x: any) => x?.url) || []}>
                <Flex wrap="wrap" gap={16}>
                  {task?.problem_images?.map((image: any, index: number) => (
                    <Image
                      key={index}
                      width={200}
                      height={200}
                      loading="lazy"
                      style={{
                        borderRadius: "8px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      src={image?.url}
                    />
                  ))}
                </Flex>
              </Image.PreviewGroup>
            ) : (
              <Flex justify="center" align="center" style={{ minHeight: 100 }}>
                <Typography.Text type="secondary">Không có hình ảnh</Typography.Text>
              </Flex>
            )}
          </Card>
          {task?.status !== "Pending" && task?.result_content && (
            <Card
              title={
                <Flex align="center" gap={8}>
                  <InfoCircleOutlined />
                  <Typography.Text strong>Kết quả</Typography.Text>
                </Flex>
              }
              style={{ borderRadius: "8px" }}
            >
              <Typography.Paragraph style={{ margin: 0 }}>
                {task?.result_content}
              </Typography.Paragraph>
            </Card>
          )}
          <Card
            title={
              <Flex align="center" gap={8}>
                <FileTextOutlined />
                <Typography.Text strong>Mô tả vấn đề</Typography.Text>
              </Flex>
            }
            style={{ borderRadius: "8px" }}
          >
            <Typography.Paragraph style={{ margin: 0 }}>{task?.description}</Typography.Paragraph>
          </Card>
          <Card
            title={
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={8}>
                  <DiffOutlined />
                  <Typography.Text strong>Hoạt động</Typography.Text>
                </Flex>
                {task?.status === "Pending" && (
                  <Flex gap={8}>
                    <Tooltip title="Phân công công việc">
                      <Button icon={<DiffOutlined />} onClick={() => setOpenAssignTasks(true)}>
                        Phân việc
                      </Button>
                    </Tooltip>
                    <Tooltip title="Thêm công việc mới">
                      <Button
                        type="primary"
                        onClick={() => {
                          setSelectTaskId(undefined);
                          setMethodTask("create");
                          setOpen(true);
                        }}
                        icon={<PlusCircleOutlined />}
                      >
                        Thêm
                      </Button>
                    </Tooltip>
                  </Flex>
                )}
              </Flex>
            }
            style={{ borderRadius: "8px" }}
          >
            {isAbilityToReport === false && (
              <Typography.Text
                type="danger"
                style={{
                  display: "block",
                  marginBottom: 16,
                  fontStyle: "italic",
                }}
              >
                * Có công việc chưa được phân công
              </Typography.Text>
            )}
            <Table
              loading={taskLoading}
              columns={columns}
              dataSource={tasks}
              scroll={{ x: "max-content" }}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
              }}
            />
          </Card>
        </Flex>
        <ReportProblemModal
          problemsId={task?.id}
          refetch={() => {
            tasksRefetch();
            problemRefetch();
            if (props?.refetch) props?.refetch();
          }}
          close={() => {
            setIsModalOpen(false);
          }}
          open={isModalOpen}
          status={defaultReportStatus}
        />
      </Drawer>
    </>
  );
};
