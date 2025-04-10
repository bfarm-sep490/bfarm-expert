import { DashboardOutlined } from "@ant-design/icons";
import { ShowButton } from "@refinedev/antd";
import { useOne } from "@refinedev/core";
import { Card, Flex } from "antd";
import { ApexOptions } from "apexcharts";
import { set } from "lodash";
import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router";

export const CaringTaskDashboard = () => {
  const { id } = useParams();
  const { data: caringTasksDashboardData, isLoading } = useOne({
    resource: `caring-tasks`,
    id: `count/plans/${id}`,
  });
  const [state1, setState1] = React.useState<{
    series: { name: string; data: number[] }[];
    options: ApexOptions;
  }>({
    series: [],
    options: {
      chart: {
        type: "bar",
        height: 430,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        categories: [
          "Tưới nước",
          "Bón phân",
          "Phun thuốc",
          "Gieo hạt",
          "Chăm sóc",
          "Cắt tỉa",
          "Làm cỏ",
        ],
      },
    },
  });
  useEffect(() => {
    const watering = caringTasksDashboardData?.data?.watering || {
      complete_quantity: 0,
      incomplete_quantity: 0,
      ongoing_quantity: 0,
      pending_quantity: 0,
      cancel_quantity: 0,
    };
    const fertilizer = caringTasksDashboardData?.data?.fertilizer || {
      complete_quantity: 0,
      incomplete_quantity: 0,
      ongoing_quantity: 0,
      pending_quantity: 0,
      cancel_quantity: 0,
    };
    const nuturing = caringTasksDashboardData?.data?.nuturing || {
      complete_quantity: 0,
      incomplete_quantity: 0,
      ongoing_quantity: 0,
      pending_quantity: 0,
      cancel_quantity: 0,
    };
    const planting = caringTasksDashboardData?.data?.planting || {
      complete_quantity: 0,
      incomplete_quantity: 0,
      ongoing_quantity: 0,
      pending_quantity: 0,
      cancel_quantity: 0,
    };
    const pesticide = caringTasksDashboardData?.data?.pesticide || {
      complete_quantity: 0,
      incomplete_quantity: 0,
      ongoing_quantity: 0,
      pending_quantity: 0,
      cancel_quantity: 0,
    };
    const pruning = caringTasksDashboardData?.data?.pruning || {
      complete_quantity: 0,
      incomplete_quantity: 0,
      ongoing_quantity: 0,
      pending_quantity: 0,
      cancel_quantity: 0,
    };
    const weeding = caringTasksDashboardData?.data?.weeding || {
      complete_quantity: 0,
      incomplete_quantity: 0,
      ongoing_quantity: 0,
      pending_quantity: 0,
      cancel_quantity: 0,
    };
    setState1({
      series: [
        {
          name: "Đã hoàn thành",
          data: [
            watering.complete_quantity,
            fertilizer.complete_quantity,
            pesticide.complete_quantity,
            planting.complete_quantity,
            nuturing.complete_quantity,
            pruning.complete_quantity,
            weeding.complete_quantity,
          ],
        },
        {
          name: "Chưa hoàn thành",
          data: [
            watering.incomplete_quantity,
            fertilizer.incomplete_quantity,
            pesticide.incomplete_quantity,
            planting.incomplete_quantity,
            nuturing.incomplete_quantity,
            pruning.incomplete_quantity,
            weeding.incomplete_quantity,
          ],
        },
        {
          name: "Đang tiến hành",
          data: [
            watering.ongoing_quantity,
            fertilizer.ongoing_quantity,
            pesticide.ongoing_quantity,
            planting.ongoing_quantity,
            nuturing.ongoing_quantity,
            pruning.ongoing_quantity,
            weeding.ongoing_quantity,
          ],
        },
        {
          name: "Chờ xác nhận",
          data: [
            watering.pending_quantity,
            fertilizer.pending_quantity,
            pesticide.pending_quantity,
            planting.pending_quantity,
            nuturing.pending_quantity,
            pruning.pending_quantity,
            weeding.pending_quantity,
          ],
        },
        {
          name: "Hủy bỏ",
          data: [
            watering.cancel_quantity,
            fertilizer.cancel_quantity,
            pesticide.cancel_quantity,
            planting.cancel_quantity,
            nuturing.cancel_quantity,
            pruning.cancel_quantity,
            weeding.cancel_quantity,
          ],
        },
      ],
      options: state1.options,
    });
  }, [caringTasksDashboardData]);

  return (
    <Card
      loading={isLoading}
      title={
        <Flex align="center" gap={8}>
          <DashboardOutlined />
          {"Biểu đồ tổng hợp công việc chăm sóc"}
        </Flex>
      }
      extra={<ShowButton hideText size="small" />}
    >
      <ReactApexChart
        options={state1.options as ApexOptions}
        series={state1.series}
        type="bar"
        height={300}
      />
    </Card>
  );
};
