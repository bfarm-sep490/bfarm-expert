import { IProblem } from "@/interfaces";
import { DashboardOutlined } from "@ant-design/icons";
import { Card, Flex } from "antd";
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

type ProblemsDashBoardProps = {
  data: IProblem[];
};

export const ProblemsDashBoard = ({ data }: ProblemsDashBoardProps) => {
  const [state3, setState3] = React.useState({
    series: [
      {
        name: "Problems",
        data: [] as { x: number; y: number }[], // to store problems per day
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
          formatter: (value: any) => `${value} problems`,
        },
      },
    },
    seriesLine: [
      {
        name: "Problems",
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

    data.forEach((problem) => {
      const date = new Date(problem.created_date).toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format
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
          name: "Problems",
          data: seriesData,
        },
      ],
      seriesLine: [
        {
          name: "Problems",
          data: seriesData,
        },
      ],
    }));
  }, [data]);

  return (
    <Card
      title={
        <Flex gap={8}>
          <DashboardOutlined />
          {"Biểu đồ xu hướng xảy ra vấn đề"}
        </Flex>
      }
    >
      <div id="chart-line2" style={{ marginBottom: "0px" }}>
        <ReactApexChart
          options={state3.options as ApexOptions}
          series={state3.series}
          type="line"
          height={180}
        />
      </div>
      <div id="chart-line">
        <ReactApexChart
          style={{ marginTop: "0px" }}
          options={state3.optionsLine as ApexOptions}
          series={state3.seriesLine}
          type="area"
          height={80}
        />
      </div>
    </Card>
  );
};
