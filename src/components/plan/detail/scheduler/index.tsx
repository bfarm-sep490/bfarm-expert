import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { BaseRecord, useList, useTranslate } from "@refinedev/core";
import { Navigate, useNavigate, useParams } from "react-router";
import { format, parse, startOfWeek, getDay } from "date-fns";

import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  InputNumber,
  notification,
  Segmented,
  Space,
  Spin,
  Table,
  Tabs,
  Typography,
} from "antd";
import { vi } from "date-fns/locale/vi";
import "./index.css";
import dayjs from "dayjs";
import {
  BarsOutlined,
  CalendarOutlined,
  DiffOutlined,
  LoadingOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { StatusTag } from "@/components/caring-task/status-tag";
import { CaringTypeTag } from "@/components/caring-task/type-tag";
import { DateField, ShowButton, TextField } from "@refinedev/antd";
import { ProductiveTaskShow } from "@/components/caring-task/show";
import { HarvestingTaskShow } from "@/components/harvesting-task/show";
import { PackagingTaskShow } from "@/components/packaging-task/show";
import { InspectionsShow } from "@/components/inspection";
import { AssignTaskModal } from "../assign-tasks-modal";
import { on } from "events";

const locales = {
  vi,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Bắt đầu từ thứ 2
  getDay,
  locales,
});

// Defined status color map outside to ensure it's always available
const STATUS_COLOR_MAP = {
  Pending: { color: "#DC6B08", bg: "#FFF7E6" },
  Complete: { color: "#389E0D", bg: "#F6FFED" },
  Ongoing: { color: "#0973E4", bg: "#E6F4FF" },
  Cancel: { color: "#D81322", bg: "#FFF1F0" },
  Incomplete: { color: "#FAFAFA", bg: "#FAFAFA" },
  default: { color: "#000000", bg: "#FFFFFF" }, // Fallback colors
};

var defaultMessages = {
  date: "Ngày",
  time: "Giờ",
  event: "Hoạt động",
  allDay: "Cả ngày",
  week: "Tuần",
  work_week: "Tuần làm việc",
  day: "Ngày",
  month: "Tháng",
  previous: "Sau",
  next: "Tiếp",
  yesterday: "Hôm qua",
  tomorrow: "Ngày mai",
  today: "Hôm nay",
  agenda: "Lịch trình",
  noEventsInRange: "Không hoạt động nào trong khoảng này.",
  showMore: function showMore(total: any) {
    return "+" + total + " cái khác";
  },
};

export const ScheduleComponent = () => {
  const [open, setOpen] = useState(false);
  const [viewComponent, setViewComponent] = useState("Schedule");

  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const translate = useTranslate();
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [taskId, setTaskId] = useState<number | null>(null);
  const [taskType, setTaskType] = useState<
    "Caring" | "Harvest" | "Packaging" | "Inspecting" | null
  >();

  const [api, contextHolder] = notification.useNotification();

  const [showTask, setShowTask] = useState(false);
  const [events, setEvents] = useState<
    {
      id: number;
      title: string;
      start: Date;
      end: Date;
      type: "Chăm sóc" | "Thu hoạch" | "Đóng gói" | "Kiểm định";
      status: keyof typeof STATUS_COLOR_MAP;
      actor_id: number;
      actor_name: string;
      avatar: string;
    }[]
  >([]);

  const { data: chosenFarmerData, isLoading: chosenFarmerLoading } = useList({
    resource: `farmers`,
  });
  const {
    data: caringData,
    isLoading: caringLoading,
    refetch: caringRefetch,
    isFetching: caringFetching,
  } = useList({
    resource: "caring-tasks",
    filters: [
      { field: "plan_id", operator: "eq", value: id },
      {
        field: "status",
        operator: "eq",
        value: ["Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
      },
    ],
  });
  const {
    data: harvestData,
    isLoading: harvestLoading,
    refetch: harvestingRefetch,
    isFetching: harvestingFetching,
  } = useList({
    resource: "harvesting-tasks",
    filters: [
      { field: "plan_id", operator: "eq", value: id },
      {
        field: "status",
        operator: "eq",
        value: ["Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
      },
    ],
  });
  const {
    data: packingData,
    isLoading: packingLoading,
    refetch: packagingRefetch,
    isFetching: packagingFetching,
  } = useList({
    resource: "packaging-tasks",
    filters: [
      { field: "plan_id", operator: "eq", value: id },
      {
        field: "status",
        operator: "eq",
        value: ["Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
      },
    ],
  });
  const {
    data: inspectionData,
    isLoading: inspectionLoading,
    refetch: inspectingRefetch,
    isFetching: inspectingFetching,
  } = useList({
    resource: "inspecting-forms",
    filters: [
      { field: "plan_id", operator: "eq", value: id },
      {
        field: "status",
        operator: "eq",
        value: ["Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
      },
    ],
  });
  const { data: inspectorData, isLoading: inspectorLoading } = useList({
    resource: "inspectors",
  });

  const inspectors = inspectorData?.data;
  const farmers = chosenFarmerData?.data;
  const refetchAll = () => {
    caringRefetch();
    harvestingRefetch();
    packagingRefetch();
    inspectingRefetch();
  };
  useEffect(() => {
    if (
      caringLoading ||
      harvestLoading ||
      packingLoading ||
      inspectionLoading ||
      inspectorLoading ||
      chosenFarmerLoading
    )
      return;

    if (
      caringData?.data &&
      harvestData?.data &&
      packingData?.data &&
      inspectionData?.data &&
      inspectorData?.data &&
      chosenFarmerData?.data
    ) {
      const allEvents = [
        ...caringData.data.map((task) => ({
          id: task.id as number,
          title: task.task_name,
          start: new Date(task.start_date),
          end: new Date(task.end_date),
          type: "Chăm sóc" as const,
          status: task.status as keyof typeof STATUS_COLOR_MAP,
          actor_id: task.farmer_id as number,
          actor_name: farmers?.find((farmer) => farmer.id === task.farmer_id)?.name,
          avatar: farmers?.find((farmer) => farmer.id === task.farmer_id)?.avatar_image,
        })),
        ...harvestData.data.map((task) => ({
          id: task.id as number,
          title: task.task_name,
          start: new Date(task.start_date),
          end: new Date(task.end_date),
          type: "Thu hoạch" as const,
          status: task.status as keyof typeof STATUS_COLOR_MAP,
          actor_id: task.farmer_id as number,
          actor_name: farmers?.find((farmer) => farmer.id === task.farmer_id)?.name,
          avatar: farmers?.find((farmer) => farmer.id === task.farmer_id)?.avatar_image,
        })),
        ...packingData.data.map((task) => ({
          id: task.id as number,
          title: task.task_name,
          start: new Date(task.start_date),
          end: new Date(task.end_date),
          type: "Đóng gói" as const,
          status: task.status as keyof typeof STATUS_COLOR_MAP,
          actor_id: task.farmer_id as number,
          actor_name: farmers?.find((farmer) => farmer.id === task.farmer_id)?.name,
          avatar: farmers?.find((farmer) => farmer.id === task.farmer_id)?.avatar_image,
        })),
        ...inspectionData.data.map((form) => ({
          id: form.id as number,
          title: form.task_name,
          start: new Date(form.start_date),
          end: new Date(form.end_date),
          type: "Kiểm định" as const,
          status: form.status as keyof typeof STATUS_COLOR_MAP,
          actor_id: inspectors?.find((inspector) => inspector.id === form.inspector_id)
            ?.id as number,
          actor_name: inspectors?.find((inspector) => inspector.id === form.inspector_id)?.name,
          avatar: inspectors?.find((inspector) => inspector.id === form.inspector_id)?.image_url,
        })),
      ].filter((event) => event.id !== undefined);

      const sort = allEvents.sort((a, b) => {
        return (
          new Date(a.end).getDate() -
          new Date(a.start).getDate() -
          (new Date(b.end).getDate() - new Date(b.start).getDate())
        );
      });
      setEvents(sort);
      setIsLoading(false);
    }
  }, [
    caringData,
    harvestData,
    packingData,
    inspectionData,
    caringLoading,
    harvestLoading,
    packingLoading,
    inspectionLoading,
    inspectorLoading,
    chosenFarmerLoading,
    inspectors,
    farmers,
  ]);

  return (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <Flex gap={10}>
            <Typography.Title level={5}>📅 Lịch kế hoạch</Typography.Title>
            {isLoading ||
            caringFetching ||
            harvestingFetching ||
            inspectingFetching ||
            packagingFetching ? (
              <Spin indicator={<LoadingOutlined spin />} size="small"></Spin>
            ) : (
              <ReloadOutlined onClick={refetchAll} />
            )}
          </Flex>
          <Segmented
            disabled={
              isLoading ||
              caringFetching ||
              harvestingFetching ||
              inspectingFetching ||
              packagingFetching
            }
            size="large"
            vertical={false}
            onChange={(value) => setViewComponent(value)}
            options={[
              { value: "List", icon: <BarsOutlined /> },
              { value: "Schedule", icon: <CalendarOutlined /> },
            ]}
          />
        </Flex>
      }
      loading={
        isLoading || caringFetching || harvestingFetching || inspectingFetching || packagingFetching
      }
    >
      <Flex justify="end" align="center" gap={10} style={{ marginBottom: 10 }}>
        <Button
          icon={<DiffOutlined />}
          type="default"
          onClick={() => {
            setOpen(true);
          }}
        >
          Phân công
        </Button>
        <Button icon={<PlusSquareOutlined />} type="primary">
          Thêm
        </Button>
      </Flex>
      {isLoading ||
      caringFetching ||
      harvestingFetching ||
      inspectingFetching ||
      packagingFetching ? (
        <Spin>Đang tải ....</Spin>
      ) : (
        <>
          {viewComponent === "Schedule" && (
            <Calendar
              popup
              messages={defaultMessages}
              localizer={localizer}
              onDoubleClickEvent={(event) => {
                if (event.type === "Kiểm định") {
                  setTaskId(event.id);
                  setTaskType("Inspecting");
                  setShowTask(true);
                } else if (event.type === "Đóng gói") {
                  setTaskId(event.id);
                  setTaskType("Packaging");
                  setShowTask(true);
                } else if (event.type === "Chăm sóc") {
                  setTaskId(event.id);
                  setTaskType("Caring");
                  setShowTask(true);
                } else if (event.type === "Thu hoạch") {
                  setTaskId(event.id);
                  setTaskType("Harvest");
                  setShowTask(true);
                } else {
                  return;
                }
              }}
              events={events.map((event) => {
                const statusColor = STATUS_COLOR_MAP[event.status] || STATUS_COLOR_MAP.default;

                return {
                  title: (
                    <Flex
                      dir="row"
                      justify="space-between"
                      align="center"
                      style={{
                        width: "100%",
                        padding: "0 4px",
                      }}
                    >
                      <Typography.Text strong style={{ color: statusColor.color }}>
                        {event.title}
                      </Typography.Text>
                      <Flex align="center" gap={8}>
                        {window.innerWidth > 768 && (
                          <Typography.Text style={{ color: "gray", fontSize: 12 }}>
                            {event?.actor_name}
                          </Typography.Text>
                        )}
                        <Avatar src={event?.avatar} alt="" size={"small"} />
                      </Flex>
                    </Flex>
                  ),
                  start: new Date(event.start),
                  end: new Date(event.end),
                  status: event.status,
                  id: event.id,
                  type: event.type,
                };
              })}
              view={view as View}
              date={currentDate}
              onView={(newView) => setView(newView)}
              onNavigate={(newDate) => setCurrentDate(newDate)}
              views={["month", "week", "day", "agenda"]}
              style={{ height: 800 }}
              eventPropGetter={(event) => {
                const statusColor =
                  STATUS_COLOR_MAP[event.status as keyof typeof STATUS_COLOR_MAP] ||
                  STATUS_COLOR_MAP.default;

                return {
                  style: {
                    border: `1px solid ${statusColor.color}`,
                    backgroundColor: statusColor.bg,
                    color: statusColor.color,
                  },
                };
              }}
            />
          )}
        </>
      )}
      {viewComponent === "List" && (
        <Tabs defaultActiveKey="caring">
          <Tabs.TabPane
            tab={translate("caring_task.title", "Chăm sóc")}
            icon={
              <Badge
                count={caringData?.data?.filter((x) => x?.status === "Pending")?.length}
              ></Badge>
            }
            key="caring"
          >
            <Table
              onRow={(record: any) => ({
                onClick: () => {
                  setTaskId(record?.id);
                  setTaskType("Caring");
                  setShowTask(true);
                },
              })}
              dataSource={caringData?.data}
              pagination={{ pageSize: 5 }}
              rowKey="id"
              scroll={{ x: "max-content" }}
            >
              <Table.Column
                dataIndex="id"
                title={translate("ID")}
                render={(value) => <TextField value={"#" + value} style={{ fontWeight: "bold" }} />}
              />
              <Table.Column
                dataIndex="task_name"
                title={translate("caring_task.task_name", "Tên công việc")}
              />
              <Table.Column
                dataIndex="start_date"
                title={translate("caring_task.start_date", "Ngày bắt đầu")}
                render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
              />
              <Table.Column
                dataIndex="end_date"
                title={translate("caring_task.end_date", " Ngày kết thúc")}
                render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
              />
              <Table.Column
                dataIndex="task_type"
                title={translate("caring_task.task_type", "Loại công việc")}
                render={(value) => <CaringTypeTag status={value} />}
              />
              <Table.Column
                dataIndex="status"
                title={translate("caring_task.status", "Trạng thái")}
                render={(value) => <StatusTag status={value} />}
              />
              <Table.Column
                title={translate("caring_task.farmer_name", "Tên nông dân")}
                dataIndex="farmer_id"
                render={(value, record) => {
                  return (
                    <TextField
                      value={
                        value
                          ? record?.farmer_information?.find((x: any) => x.farmer_id === value)
                              ?.farmer_name
                          : "Không xác định được nông dân"
                      }
                    />
                  );
                }}
              />
              <Table.Column
                title={translate("caring_task.plan_name", "Tên kế hoạch")}
                dataIndex="plan_name"
                render={(value) => {
                  return <TextField value={value ? value : "Không xác định được kế hoạch"} />;
                }}
              />
              <Table.Column
                title={translate("caring_task.create_at", "Ngày tạo")}
                dataIndex="create_at"
                render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
              />
              <Table.Column
                title={translate("caring_task.update_at", "Ngày cập nhập")}
                dataIndex="update_at"
                render={(value) =>
                  value ? (
                    <DateField format="DD/MM/YYYY" value={value} />
                  ) : (
                    <TextField value={"Chưa cập nhập"} />
                  )
                }
              />
            </Table>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={translate("inspecting_task.title", "Kiểm định")}
            key="inspecting"
            icon={
              <Badge
                count={inspectorData?.data?.filter((x) => x?.status === "Pending")?.length}
              ></Badge>
            }
          >
            <Table
              onRow={(record: any) => ({
                onClick: () => {
                  setTaskId(record?.id);
                  setTaskType("Inspecting");
                  setShowTask(true);
                },
              })}
              dataSource={inspectionData?.data}
              rowKey="id"
              scroll={{ x: true }}
              pagination={{
                pageSize: 5,
              }}
            >
              <Table.Column title="ID" dataIndex="id" key="id" width={80} />

              <Table.Column title="Tên kế hoạch" dataIndex="plan_name" key="plan_name" />
              <Table.Column title="Tên công việc" dataIndex="task_name" key="task_name" />

              <Table.Column
                title="Người kiểm tra"
                dataIndex="inspector_name"
                key="inspector_name"
              />
              <Table.Column
                title="Ngày bắt đầu"
                dataIndex="start_date"
                key="start_date"
                render={(value: string) => dayjs(value).format("DD/MM/YYYY HH:mm")}
              />

              <Table.Column
                title="Ngày kết thúc"
                dataIndex="end_date"
                key="end_date"
                render={(value: string) => dayjs(value).format("DD/MM/YYYY HH:mm")}
              />

              <Table.Column
                title="Trạng thái"
                dataIndex="status"
                key="status"
                render={(status) => <StatusTag status={status} />}
              />
            </Table>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={translate("harvesting_task.title", "Thu hoạch")}
            key="harvest"
            icon={
              <Badge
                count={harvestData?.data?.filter((x) => x?.status === "Pending")?.length}
              ></Badge>
            }
          >
            <Table
              onRow={(record: any) => ({
                onClick: () => {
                  setTaskId(record?.id);
                  setTaskType("Harvest");
                  setShowTask(true);
                },
              })}
              dataSource={harvestData?.data}
              pagination={{
                pageSize: 5,
              }}
              rowKey="id"
              scroll={{ x: "max-content" }}
            >
              <Table.Column
                dataIndex="id"
                title={translate("ID")}
                render={(value) => <TextField value={"#" + value} style={{ fontWeight: "bold" }} />}
              />
              <Table.Column
                dataIndex="task_name"
                title={translate("harvesting_task.task_name", "Tên công việc")}
              />
              <Table.Column
                dataIndex="start_date"
                title={translate("harvesting_task.start_date", "Thời gian bắt đầu")}
                render={(value) => <DateField format="hh:mm DD/MM/YYYY" value={value} />}
              />
              <Table.Column
                dataIndex="end_date"
                title={translate("harvesting_task.end_date", "Thời gian kết thúc")}
                render={(value) => <DateField format="hh:mm DD/MM/YYYY" value={value} />}
              />
              <Table.Column
                dataIndex="harvested_quantity"
                title={translate("harvesting_task.harvested_quantity", "Sản lượng thu hoạch")}
                render={(value) => <TextField value={value ? value + " kg" : "Chưa thu hoạch"} />}
              />

              <Table.Column
                dataIndex="status"
                title={translate("harvesting_task.status", "Trạng thái")}
                render={(value) => <StatusTag status={value} />}
              />
              <Table.Column
                title={translate("harvesting_task.farmer_name", "Tên nông dân")}
                dataIndex="farmer_id"
                render={(value, record) => {
                  return (
                    <TextField
                      value={
                        value
                          ? record?.farmer_information?.find((x: any) => x.farmer_id === value)
                              ?.farmer_name
                          : "Không xác định được nông dân"
                      }
                    />
                  );
                }}
              />
              <Table.Column
                title={translate("harvesting_task.plan_name", "Tên kế hoạch")}
                dataIndex="plan_name"
                render={(value) => {
                  return <TextField value={value ? value : "Không xác định được kế hoạch"} />;
                }}
              />
              <Table.Column
                title={translate("harvesting_task.created_at", "Ngày tạo")}
                dataIndex="created_at"
                render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
              />
              <Table.Column
                title={translate("harvesting_task.updated_at", "Ngày cập nhập")}
                dataIndex="updated_at"
                render={(value) =>
                  value ? (
                    <DateField format="DD/MM/YYYY" value={value} />
                  ) : (
                    <TextField value={"Chưa cập nhập lần nào"} />
                  )
                }
              />
            </Table>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={translate("packaging_task.title", "Đóng gói")}
            key="packaging"
            icon={
              <Badge
                count={packingData?.data?.filter((x) => x?.status === "Pending")?.length}
              ></Badge>
            }
          >
            <Table
              onRow={(record: any) => ({
                onClick: () => {
                  setTaskId(record?.id);
                  setTaskType("Packaging");
                  setShowTask(true);
                },
              })}
              dataSource={packingData?.data}
              pagination={{
                pageSize: 5,
              }}
              rowKey="id"
              scroll={{ x: "max-content" }}
            >
              <Table.Column
                dataIndex="id"
                title={translate("ID")}
                render={(value) => <TextField value={"#" + value} style={{ fontWeight: "bold" }} />}
              />
              <Table.Column
                dataIndex="task_name"
                title={translate("packaging_task.task_name", "Tên công việc")}
              />
              <Table.Column
                dataIndex="start_date"
                title={translate("packaging_task.start_date", "Thời gian bắt đầu")}
                render={(value) => <DateField format="hh:mm DD/MM/YYYY" value={value} />}
              />
              <Table.Column
                dataIndex="end_date"
                title={translate("packaging_task.end_date", "Thời gian kết thúc")}
                render={(value) => <DateField format="hh:mm DD/MM/YYYY" value={value} />}
              />
              <Table.Column
                dataIndex="packed_quantity"
                title={translate("packaging_task.packed_quantity", "Số lượng đóng gói")}
                render={(value) => <TextField value={value ? value : "Chưa thu hoạch"} />}
              />
              <Table.Column
                dataIndex="packed_unit"
                title={translate("packaging_task.packed_unit", "Đơn vị đóng gói")}
                render={(value) => <TextField value={value ? value : "Chưa thu hoạch"} />}
              />
              <Table.Column
                dataIndex="status"
                title={translate("packaging_task.status", "Trạng thái")}
                render={(value) => <StatusTag status={value} />}
              />
              <Table.Column
                title={translate("packaging_task.farmer_name", "Tên nông dân")}
                dataIndex="farmer_id"
                render={(value, record) => {
                  return (
                    <TextField
                      value={
                        value
                          ? record?.farmer_information?.find((x: any) => x?.farmer_id === value)
                              ?.farmer_name
                          : "Chưa phân công nông dân"
                      }
                    />
                  );
                }}
              />
              <Table.Column
                title={translate("packaging_task.plan_name", "Tên kế hoạch")}
                dataIndex="plan_name"
                render={(value) => {
                  return <TextField value={value ? value : "Không xác định được kế hoạch"} />;
                }}
              />
              <Table.Column
                title={translate("packaging_task.created_at", "Ngày tạo")}
                dataIndex="created_at"
                render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
              />
              <Table.Column
                title={translate("packaging_task.updated_at", "Ngày cập nhập")}
                dataIndex="updated_at"
                render={(value) =>
                  value ? (
                    <DateField format="DD/MM/YYYY" value={value} />
                  ) : (
                    <TextField value={"Chưa cập nhập lần nào"} />
                  )
                }
              />
            </Table>
          </Tabs.TabPane>
        </Tabs>
      )}
      <ProductiveTaskShow
        onClose={() => {
          setShowTask(false);
          setTaskId(null);
          setTaskType(null);
        }}
        visible={showTask && taskId !== null && taskType === "Caring"}
        taskId={taskId as number}
      />
      <HarvestingTaskShow
        onClose={() => {
          setShowTask(false);
          setTaskId(null);
          setTaskType(null);
        }}
        visible={showTask && taskId !== null && taskType === "Harvest"}
        taskId={taskId as number}
      />
      <PackagingTaskShow
        onClose={() => {
          setShowTask(false);
          setTaskId(null);
          setTaskType(null);
        }}
        visible={showTask && taskId !== null && taskType === "Packaging"}
        taskId={taskId as number}
      />
      <InspectionsShow
        onClose={() => {
          setShowTask(false);
          setTaskId(null);
          setTaskType(null);
        }}
        visible={showTask && taskId !== null && taskType === "Inspecting"}
        taskId={taskId as number}
      />
      <AssignTaskModal
        api={api}
        planId={id ? parseInt(id, 10) : undefined}
        type="Ongoing"
        refetch={refetchAll}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Card>
  );
};
