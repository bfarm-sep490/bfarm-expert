import { ProblemShowInProblem } from "@/components/problem/drawer-show";
import { ProblemStatusTag } from "@/components/problem/status-tag";
import { IProblem } from "@/interfaces";
import {
  BarChartOutlined,
  BarsOutlined,
  DashboardOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { DateField, ShowButton, TextField } from "@refinedev/antd";
import { BaseRecord, useTranslate } from "@refinedev/core";
import { Badge, Card, Flex, Segmented, Space, Spin, Table, Typography } from "antd";
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
      },
      colors: ["#FF4560"],
      stroke: {
        width: 2,
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        labels: {
          formatter: (value: any) => `${value} ${translate("problems", "vấn đề")}`,
        },
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
      },
      colors: ["#008FFB"],
      stroke: {
        width: [1, 2],
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.85,
          opacityTo: 0.1,
        },
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        tickAmount: 2,
      },
    },
  });

  React.useEffect(() => {
    const problemsPerDay: { [key: string]: number } = {};

    data?.forEach((problem) => {
      const date = new Date(problem?.created_date).toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format
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
      style={style}
      title={
        <Flex justify="space-between" align="center">
          <Flex gap={10}>
            <Typography.Title level={5}>Vấn đề</Typography.Title>
            {loading || chartLoading ? (
              <Spin indicator={<LoadingOutlined spin />} size="small"></Spin>
            ) : (
              <ReloadOutlined onClick={refetch} />
            )}
          </Flex>
          {/* <Segmented
            disabled={loading || chartLoading}
            size="large"
            vertical={false}
            onChange={(value) => setViewComponent(value)}
            options={[
              { value: "List", icon: <BarsOutlined /> },
              { value: "Chart", icon: <BarChartOutlined /> },
            ]}
          /> */}
        </Flex>
      }
      loading={loading || chartLoading}
    >
      {loading === false && chartLoading === false && viewComponent === "Chart" && (
        <>
          <ReactApexChart
            options={state3.options as ApexOptions}
            series={state3.series}
            type="line"
            height={180}
          />
          <ReactApexChart
            style={{ marginTop: "0px" }}
            options={state3.optionsLine as ApexOptions}
            series={state3.seriesLine}
            type="area"
            height={80}
          />
        </>
      )}
      {loading === false && chartLoading === false && viewComponent === "List" && (
        <>
          <Table
            onRow={(record) => ({
              onClick: () => {
                setSelectId(record?.id as number);
                setOpen(true);
              },
            })}
            dataSource={data}
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
              dataIndex="problem_name"
              title={translate("problem_name", "Tên vấn đề")}
            />
            <Table.Column
              dataIndex="farmer_name"
              title={translate("farmer_name", "Tên nông dân")}
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
        </>
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
