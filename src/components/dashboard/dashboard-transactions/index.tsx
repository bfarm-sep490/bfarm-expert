import { Card, Spin } from "antd";
import { ApexOptions } from "apexcharts";
import { title } from "process";
import ReactApexChart from "react-apexcharts";

type Props = {
  transactionsData: any;
  style?: React.CSSProperties;
  loading?: boolean;
};

export const DashboardTransactions = ({ transactionsData, style, loading }: Props) => {
  const processedData = transactionsData?.data
    ? transactionsData.data
        .sort((a: any, b: any) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        })
        .map((item: any) => ({
          x: new Date(item.date).getTime(),
          y: item.price_per_day || 0,
        }))
    : [];

  const revenueChartConfig = {
    series: [
      {
        data: processedData,
      },
    ],
    options: {
      chart: {
        type: "area",
        height: 350,
        zoom: { enabled: false },
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
          },
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        type: "datetime",
        title: { text: "Thời Gian" },
        labels: {
          datetimeUTC: false,
          format: "dd/MM/yyyy",
        },
      },
      title: {
        text:
          "Tổng doanh thu: " +
          transactionsData?.data
            ?.reduce((acc: number, item: any) => acc + item?.price_per_day, 0)
            .toLocaleString() +
          " VND",
        align: "left",
        style: {
          fontSize: "16px",
          color: "#333",
        },
      },
      yaxis: {
        opposite: true,
        title: { text: "Doanh Thu (VND)" },
        labels: {
          formatter(value: any) {
            return value.toLocaleString() + " đ";
          },
        },
      },
      tooltip: {
        x: {
          format: "dd/MM/yyyy",
        },
        y: {
          formatter(value: any) {
            return value.toLocaleString() + " đ";
          },
        },
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: "#f1f1f1",
        row: {
          colors: ["transparent", "transparent"],
        },
      },
      colors: ["#52c41a"],
    },
  };

  return (
    <Card title="Doanh thu" style={style} loading={loading}>
      {transactionsData?.data && transactionsData.data.length > 0 ? (
        <ReactApexChart
          options={revenueChartConfig.options as unknown as ApexOptions}
          series={revenueChartConfig.series}
          type="area"
          height={300}
        />
      ) : (
        <div
          style={{
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
          }}
        >
          Không có dữ liệu doanh thu
        </div>
      )}
    </Card>
  );
};
