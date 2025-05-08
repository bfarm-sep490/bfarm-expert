import { DateField, TextField } from "@refinedev/antd";
import { useOne, useList, useBack, useUpdate, useGetIdentity } from "@refinedev/core";
import {
  Drawer,
  Flex,
  Typography,
  List,
  Divider,
  Image,
  Table,
  Radio,
  Space,
  Button,
  theme,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { IIdentity } from "@/interfaces";
import { StatusTag } from "@/components/caring-task/status-tag";
import { CaringTypeTag } from "@/components/caring-task/type-tag";
import TaskModal from "@/components/task-create-update";
import ChangeAssignedTasksModal, { HistoryAssignedModal } from "@/components/caring-task/show";

type TaskDrawerProps = {
  visible?: boolean;
  onClose?: () => void;
  taskId?: number;
  refetch?: () => void;
  taskType: "caring" | "harvesting" | "packaging";
};

export const GenericTaskDrawer = (props: TaskDrawerProps) => {
  const { id } = useParams();
  const back = useBack();
  const { token } = theme.useToken();
  const breakpoint = { sm: window.innerWidth > 576 };
  const { data: user } = useGetIdentity<IIdentity>();

  const [editOpen, setEditOpen] = useState(false);
  const [assignedModal, setAssignedModal] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [dataVattu, setDataVattu] = useState<any>([]);
  const [modeVattu, setModeVattu] = useState<"fertilizer" | "pesticide" | "item">("fertilizer");

  const resourceMap = {
    caring: "caring-tasks",
    harvesting: "harvesting-tasks",
    packaging: "packaging-tasks",
  };

  const {
    data: queryResult,
    isLoading: taskLoading,
    refetch: taskRefetch,
    isFetching: taskFetching,
  } = useOne<any>({
    resource: resourceMap[props?.taskType],
    id: props?.taskId,
    queryOptions: {
      enabled: props?.visible === true,
    },
  });
  const [api, contextHolder] = notification.useNotification();
  const {
    data: historyAssignedData,
    isLoading: historyAssignedLoading,
    refetch: historyAssignedRefetch,
  } = useList({
    resource: `${resourceMap[props?.taskType]}/${props?.taskId}/assigned-farmers`,
    queryOptions: {
      enabled: props?.visible === true,
    },
  });

  const {
    data: chosenFarmersData,
    isLoading: chosenFarmerLoading,
    refetch: chosenFarmerRefetch,
  } = useList({
    resource: `plans/${id}/farmers`,
    queryOptions: {
      enabled: props?.visible === true,
    },
  });

  const {
    data: packagingTypesData,
    isLoading: packagingTypesLoading,
    refetch: packagingTypesRefetch,
  } = useList({
    resource: "packaging-types",
    queryOptions: {
      enabled: props?.visible === true && props?.taskType === "packaging",
    },
  });

  const task = queryResult?.data?.[0];
  const historyAssignedFarmers = historyAssignedData?.data || [];
  const chosenFarmers = chosenFarmersData?.data || [];
  const packagingTypes = packagingTypesData?.data || [];

  const { mutate } = useUpdate({
    resource: resourceMap[props?.taskType],
    id: task?.id,
    mutationOptions: {
      onSuccess: () => {
        taskRefetch();
      },
    },
  });

  const handleModeChange = (mode: "fertilizer" | "pesticide" | "item") => {
    setModeVattu(mode);
    setDataVattu(task ? task[`care_${mode}s`] : []);
  };
  console.log("🚀 ~ GenericTaskDrawer ~ task:", task);

  const handleChangeStatus = (type: string) => {
    const baseValues = {
      task_name: task?.task_name,
      description: task?.description,
      start_date: task?.start_date,
      end_date: task?.end_date,
      updated_by: user?.name,
      status: type,
    };

    let values;
    if (props?.taskType === "caring") {
      values = {
        ...baseValues,
        task_type: task?.task_type,
        fertilizers: task?.fertilizers,
        pesticides: task?.pesticides,
        items: task?.items,
      };
    } else if (props?.taskType === "packaging") {
      values = {
        ...baseValues,
        packaging_type_id: task?.packaging_type_id,
        items: task?.items,
      };
    } else {
      values = {
        ...baseValues,
        items: task?.items,
      };
    }

    mutate({
      id: task?.id,
      values,
    });
  };

  const handleRefreshAll = () => {
    props?.refetch?.();
    taskRefetch();
    historyAssignedRefetch();
    chosenFarmerRefetch();
    if (props?.taskType === "packaging") packagingTypesRefetch();
  };

  useEffect(() => {
    if (props?.visible) {
      handleRefreshAll();
    } else {
      setHistoryVisible(false);
      setAssignedModal(false);
    }
  }, [props?.visible]);

  useEffect(() => {
    if (props?.taskType === "caring" && task) {
      setDataVattu(task[`care_${modeVattu}s`] || []);
    }
  }, [task, props?.taskType, modeVattu]);

  const getColumns = () => {
    if (props?.taskType === "caring" && modeVattu === "fertilizer") {
      return [
        { title: "ID", dataIndex: "fertilizer_id", key: "id" },
        { title: "Tên", dataIndex: "fertilizer_name", key: "name" },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
        { title: "Đơn vị", dataIndex: "unit", key: "unit" },
      ];
    } else if (props?.taskType === "caring" && modeVattu === "pesticide") {
      return [
        { title: "ID", dataIndex: "pesticide_id", key: "id" },
        { title: "Tên", dataIndex: "pesticide_name", key: "name" },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
        { title: "Đơn vị", dataIndex: "unit", key: "unit" },
      ];
    } else {
      return [
        { title: "ID", dataIndex: "item_id", key: "id" },
        { title: "Tên", dataIndex: "item_name", key: "name" },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
        { title: "Đơn vị", dataIndex: "unit", key: "unit" },
      ];
    }
  };

  const getResultData = () => {
    const baseItems = [
      {
        label: "Ngày hoàn thành",
        value: (
          <DateField format="hh:mm DD/MM/YYYY" value={task?.complete_date || task?.complete_at} />
        ),
      },
      {
        label: "Nội dung",
        value: (
          <Typography.Paragraph>{task?.result_content || "Không có nội dung"}</Typography.Paragraph>
        ),
      },
    ];

    if (props?.taskType === "harvesting") {
      return [
        ...baseItems,
        {
          label: "Sản lượng thu hoạch",
          value: (
            <Typography.Text>
              {task?.harvested_quantity} {" kg"}
            </Typography.Text>
          ),
        },
      ];
    } else if (props?.taskType === "packaging") {
      return [
        ...baseItems,
        {
          label: "Số lượng đóng gói",
          value: <Typography.Text>{task?.packed_quantity}</Typography.Text>,
        },
      ];
    }

    return baseItems;
  };

  const getBasicTaskDetails = () => {
    const commonDetails = [
      {
        label: "Ngày bắt đầu",
        value: <DateField format="hh:mm DD/MM/YYYY" value={task?.start_date} />,
      },
      {
        label: "Ngày kết thúc",
        value: <DateField format="hh:mm DD/MM/YYYY" value={task?.end_date} />,
      },
      {
        label: "Trạng thái",
        value: <StatusTag status={task?.status} />,
      },
      {
        label: "Kế hoạch",
        value: task?.plan_name,
      },
      {
        label: "Mô tả công việc",
        value: <Typography.Paragraph>{task?.description}</Typography.Paragraph>,
      },
    ];

    if (props?.taskType === "caring") {
      return [
        {
          label: "Loại công việc",
          value: <CaringTypeTag status={task?.task_type} />,
        },
        ...commonDetails,
        {
          label: "Vấn đề liên quan",
          value: task?.problem_name || "Không liên hệ tới vấn đề nào",
        },
      ];
    } else if (props?.taskType === "packaging") {
      return [
        ...commonDetails,
        {
          label: "Loại đóng gói",
          value: task?.packaging_type_id
            ? packagingTypes?.find((x) => x.id === task?.packaging_type_id)?.name
            : "Chưa xác định",
        },
      ];
    }

    return commonDetails;
  };

  const getCreationDetails = () => {
    return [
      {
        label: "Ngày tạo",
        value: <DateField format="hh:mm DD/MM/YYYY" value={task?.created_at} />,
      },
      {
        label: "Người tạo",
        value: <TextField value={task?.created_by} />,
      },
      {
        label: "Cập nhật lần cuối",
        value: task?.updated_at ? (
          <DateField format="hh:mm DD/MM/YYYY" value={task?.updated_at} />
        ) : (
          "Chưa cập nhật lần nào"
        ),
      },
      {
        label: "Người cập nhật cuối",
        value: <TextField value={task?.updated_by} />,
      },
    ];
  };

  const getAssignedFarmerDetails = () => {
    return [
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
    ];
  };

  const getTaskItems = () => {
    if (props?.taskType === "caring") {
      return dataVattu;
    } else if (props?.taskType === "harvesting") {
      return task?.harvesting_items;
    } else {
      return task?.packaging_items;
    }
  };

  const getTaskImages = () => {
    if (props?.taskType === "caring") {
      return task?.care_images?.map((x: any) => x.url) || [];
    } else if (props?.taskType === "harvesting") {
      return task?.harvest_images?.map((x: any) => x.url) || [];
    } else {
      return task?.packaging_images?.map((x: any) => x.url) || [];
    }
  };

  const getFirstImage = () => {
    if (props?.taskType === "caring") {
      return task?.care_images?.[0]?.url;
    } else if (props?.taskType === "harvesting") {
      return task?.harvest_images?.[0]?.url;
    } else {
      return task?.packaging_images?.[0]?.url;
    }
  };

  return (
    <Drawer
      style={{ background: token.colorBgLayout }}
      headerStyle={{
        background: token.colorBgContainer,
      }}
      open={props?.visible}
      width={breakpoint.sm ? "60%" : "100%"}
      onClose={props?.onClose || back}
      title={
        <>
          {task?.status === "Ongoing" && (
            <Flex justify="end">
              <Space>
                <Button onClick={() => handleChangeStatus("Cancel")} danger>
                  Hủy bỏ
                </Button>
              </Space>
            </Flex>
          )}
          {task?.status === "Pending" && (
            <Flex justify="end">
              <Space>
                <Button onClick={() => handleChangeStatus("Cancel")} danger>
                  Không chấp nhận
                </Button>
                <Button onClick={() => handleChangeStatus("Ongoing")} type="primary">
                  Tiến hành
                </Button>
              </Space>
            </Flex>
          )}
          {task?.status === "Draft" && (
            <Flex justify="end">
              <Space>
                <Button onClick={() => handleChangeStatus("Cancel")} danger>
                  Xóa
                </Button>
                <Button
                  onClick={() => {
                    if (task?.farmer_id === null) {
                      api.error({
                        message: "Vui lòng chọn nông dân tham gia trước khi xác nhận",
                      });
                      return;
                    }
                    handleChangeStatus("Pending");
                  }}
                  type="primary"
                >
                  Xác nhận
                </Button>
              </Space>
            </Flex>
          )}
        </>
      }
    >
      {contextHolder}
      <Flex vertical gap={24} style={{ padding: "32px" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          <strong>#{task?.id}</strong> - {task?.task_name}
        </Typography.Title>

        <Divider />
        <Typography.Title level={4}>Kết quả</Typography.Title>
        {task?.status === "Complete" ? (
          <Flex vertical gap={16}>
            {(props?.taskType === "caring" && task?.care_images?.length > 0) ||
            (props?.taskType === "harvesting" && task?.harvest_images?.length > 0) ||
            (props?.taskType === "packaging" && task?.packaging_images?.length > 0) ? (
              <Image.PreviewGroup items={getTaskImages()}>
                <Image loading="lazy" style={{ borderRadius: "10px" }} src={getFirstImage()} />
              </Image.PreviewGroup>
            ) : null}

            <List
              style={{ backgroundColor: token.colorBgContainer }}
              bordered
              dataSource={getResultData()}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
                </List.Item>
              )}
            />
          </Flex>
        ) : (
          <Typography.Text type="secondary">
            {props?.taskType === "caring" ? "Chưa có kết quả." : "Không có kết quả."}
          </Typography.Text>
        )}

        <Divider />
        <Flex justify="space-between" align="center">
          <Typography.Title level={4}>Chi tiết công việc</Typography.Title>
          {task?.status === "Draft" && (
            <Button type="primary" onClick={() => setEditOpen(true)}>
              Thay đổi
            </Button>
          )}
        </Flex>
        <List
          style={{ backgroundColor: token.colorBgContainer }}
          bordered
          dataSource={getBasicTaskDetails()}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
            </List.Item>
          )}
        />

        <List
          style={{ backgroundColor: token.colorBgContainer }}
          bordered
          dataSource={getCreationDetails()}
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
            <Button type="default" onClick={() => setHistoryVisible(true)}>
              Lịch sử
            </Button>
            {(task?.status === "Ongoing" ||
              task?.status === "Pending" ||
              task?.status === "Draft") && (
              <Button type="primary" onClick={() => setAssignedModal(true)}>
                Thay đổi
              </Button>
            )}
          </Space>
        </Flex>
        <List
          style={{ backgroundColor: token.colorBgContainer }}
          bordered
          dataSource={getAssignedFarmerDetails()}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
            </List.Item>
          )}
        />

        <Divider />
        <Typography.Title level={4}>
          {props?.taskType === "caring" ? "Phân bón / Thuốc trừ sâu / Vật tư" : "Vật tư"}
        </Typography.Title>

        {props?.taskType === "caring" && (
          <Radio.Group value={modeVattu} onChange={(e) => handleModeChange(e.target.value)}>
            <Radio.Button value="fertilizer">Phân bón</Radio.Button>
            <Radio.Button value="pesticide">Thuốc trừ sâu</Radio.Button>
            <Radio.Button value="item">Vật tư</Radio.Button>
          </Radio.Group>
        )}

        <Table
          style={{ backgroundColor: token.colorBgContainer }}
          pagination={{ pageSize: 5 }}
          bordered
          columns={getColumns()}
          dataSource={getTaskItems()}
        />
      </Flex>

      <HistoryAssignedModal
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        data={historyAssignedFarmers}
      />

      <ChangeAssignedTasksModal
        historyAssignedFarmers={(historyAssignedFarmers as []) ?? []}
        chosenFarmers={(chosenFarmers as []) ?? []}
        taskId={task?.id}
        refetch={handleRefreshAll}
        end_date={task?.end_date}
        start_date={task?.start_date}
        type={resourceMap[props?.taskType]}
        onClose={() => setAssignedModal(false)}
        visible={assignedModal}
        assignedFarmers={chosenFarmers.find((x) => x.id === task?.farmer_id)}
      />

      <TaskModal
        onClose={() => setEditOpen(false)}
        visible={editOpen}
        action="edit"
        planId={task?.plan_id}
        status="Draft"
        taskType={props?.taskType}
        problemId={task?.problem_id}
        taskId={task?.id}
        refetch={handleRefreshAll}
      />
    </Drawer>
  );
};

export const CaringTaskShow = (props: Omit<TaskDrawerProps, "taskType">) => {
  return <GenericTaskDrawer {...props} taskType="caring" />;
};

export const HarvestingTaskShow = (props: Omit<TaskDrawerProps, "taskType">) => {
  return <GenericTaskDrawer {...props} taskType="harvesting" />;
};

export const PackagingTaskShow = (props: Omit<TaskDrawerProps, "taskType">) => {
  return <GenericTaskDrawer {...props} taskType="packaging" />;
};

export default GenericTaskDrawer;
