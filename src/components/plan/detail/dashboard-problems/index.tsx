import { ProblemShowInProblem } from "@/components/problem/drawer-show";
import { ProblemStatusTag } from "@/components/problem/status-tag";
import { IProblem } from "@/interfaces";
import {
  BarChartOutlined,
  BarsOutlined,
  DashboardOutlined,
  LoadingOutlined,
  ReloadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { DateField, ShowButton, TextField } from "@refinedev/antd";
import { BaseRecord, useTranslate } from "@refinedev/core";
import { Badge, Card, Flex, Segmented, Space, Spin, Table, Typography, Tag } from "antd";
import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

type ProblemsDashBoardProps = {
  data?: IProblem[];
  refetch?: () => void;
  visible?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
};

export const ProblemsDashBoard = ({
  data,
  visible,
  loading,
  refetch,
  style,
}: ProblemsDashBoardProps) => {
  const [open, setOpen] = useState(false);
  const [selectId, setSelectId] = useState<number | undefined>();
  const [viewComponent, setViewComponent] = useState("List");
  const [chartLoading, setChartLoading] = useState(false);
  const translate = useTranslate();

  const [state3, setState3] = React.useState({
    series: [
      {
        name: "Vấn đề",
        data: [] as { x: number; y: number }[],
      },
    ],
    options: {
      chart: {
        id: "chart2",
        type: "line",
        height: 250,
        toolbar: {
          show: false,
        },
        background: "transparent",
      },
      colors: ["#FF4D4F"],
      stroke: {
        width: 2,
        curve: "smooth",
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 4,
        hover: {
          size: 6,
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#8c8c8c",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#8c8c8c",
          },
          formatter: (value: any) => `${value} ${translate("problems", "vấn đề")}`,
        },
      },
      grid: {
        borderColor: "#f0f0f0",
      },
      tooltip: {
        theme: "light",
      },
    },
    seriesLine: [
      {
        name: "Vấn đề",
        data: [] as { x: number; y: number }[],
      },
    ],
    optionsLine: {
      chart: {
        id: "chart1",
        height: 120,
        type: "area",
        brush: {
          target: "chart2",
          enabled: true,
        },
        selection: {
          enabled: true,
        },
        background: "transparent",
      },
      colors: ["#FF4D4F"],
      stroke: {
        width: [1, 2],
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            colors: "#8c8c8c",
          },
        },
      },
      yaxis: {
        tickAmount: 2,
        labels: {
          style: {
            colors: "#8c8c8c",
          },
        },
      },
      grid: {
        borderColor: "#f0f0f0",
      },
    },
  });

  React.useEffect(() => {
    const problemsPerDay: { [key: string]: number } = {};

    data?.forEach((problem) => {
      const date = new Date(problem?.created_date).toISOString().split("T")[0];
      if (problemsPerDay[date]) {
        problemsPerDay[date] += 1;
      } else {
        problemsPerDay[date] = 1;
      }
    });

    const seriesData = Object.keys(problemsPerDay).map((date) => ({
      x: new Date(date).getTime(),
      y: problemsPerDay[date],
    }));

    setState3((prevState) => ({
      ...prevState,
      series: [
        {
          name: "Vấn đề",
          data: seriesData,
        },
      ],
      seriesLine: [
        {
          name: "Vấn đề",
          data: seriesData,
        },
      ],
    }));
  }, [data]);

  return (
    <Card
      style={{
        ...style,
        height: "100%",
        borderRadius: 8,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      }}
      bodyStyle={{
        padding: 0,
        height: "calc(100% - 56px)",
        display: "flex",
        flexDirection: "column",
      }}
      title={
        <Flex justify="space-between" align="center">
          <Flex gap={10} align="center">
            <WarningOutlined style={{ color: "#FF4D4F", fontSize: 20 }} />
            <Typography.Title level={5} style={{ margin: 0 }}>
              Vấn đề
            </Typography.Title>
            {loading || chartLoading ? (
              <Spin indicator={<LoadingOutlined spin />} size="small" />
            ) : (
              <ReloadOutlined
                onClick={refetch}
                style={{
                  color: "#1890ff",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              />
            )}
          </Flex>
          <Tag color="red">{data?.length || 0} vấn đề</Tag>
        </Flex>
      }
      loading={loading || chartLoading}
    >
      {loading === false && chartLoading === false && viewComponent === "Chart" && (
        <div style={{ background: "transparent", flex: 1 }}>
          <ReactApexChart
            options={state3.options as ApexOptions}
            series={state3.series}
            type="line"
            height="100%"
          />
          <ReactApexChart
            style={{ marginTop: "0px" }}
            options={state3.optionsLine as ApexOptions}
            series={state3.seriesLine}
            type="area"
            height={80}
          />
        </div>
      )}
      {loading === false && chartLoading === false && viewComponent === "List" && (
        <Table
          onRow={(record) => ({
            onClick: () => {
              setSelectId(record?.id as number);
              setOpen(true);
            },
            style: { cursor: "pointer" },
          })}
          dataSource={data}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            position: ["bottomCenter"],
          }}
          rowKey="id"
          scroll={{ x: "max-content" }}
          size="small"
          style={{ flex: 1 }}
        >
          <Table.Column
            dataIndex="id"
            title={translate("ID")}
            render={(value) => <Typography.Text strong>#{value}</Typography.Text>}
          />
          <Table.Column
            dataIndex="problem_name"
            title={translate("problem_name", "Tên vấn đề")}
            render={(value) => <Typography.Text>{value}</Typography.Text>}
          />
          <Table.Column
            dataIndex="farmer_name"
            title={translate("farmer_name", "Tên nông dân")}
            render={(value) => <Typography.Text>{value}</Typography.Text>}
          />
          <Table.Column
            dataIndex="created_date"
            title={translate("problem.created_date", "Ngày phát sinh")}
            render={(value) => <DateField format="hh:mm DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="status"
            title={translate("problem.status", "Trạng thái")}
            render={(value) => <ProblemStatusTag status={value} />}
          />
        </Table>
      )}
      <ProblemShowInProblem
        onClose={() => setOpen(false)}
        open={open}
        problemId={selectId}
        refetch={refetch}
      />
    </Card>
  );
};
