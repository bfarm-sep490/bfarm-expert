import { Card } from "antd";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

type Props = {
  orderData: any;
  style?: React.CSSProperties;
  loading?: boolean;
};

export const DashboardPieOrders = ({ orderData, style, loading }: Props) => {
  const orderStatusData = useMemo(() => {
    const statusCounts = {
      PendingDeposit: 0,
      PendingConfirmation: 0,
      Cancel: 0,
      Reject: 0,
      Deposit: 0,
      Paid: 0,
    };

    orderData?.data?.forEach((order: any) => {
      if (order?.status && order.status in statusCounts) {
        statusCounts[order.status as keyof typeof statusCounts]++;
      }
    });

    return {
      series: [
        statusCounts.PendingDeposit,
        statusCounts.PendingConfirmation,
        statusCounts.Cancel,
        statusCounts.Reject,
        statusCounts.Deposit,
        statusCounts.Paid,
      ],
      labels: ["Chờ đặt cọc", "Chờ xác nhận", "Hủy bỏ", "Từ chối", "Đã đặt cọc", "Đã thanh toán"],
    };
  }, [orderData]);

  const orderStatusChartOptions = useMemo(
    () => ({
      chart: {
        width: "100%",
        height: "100%",
        type: "pie",
      },
      labels: orderStatusData.labels,
      colors: ["#4A89DC", "#ED5565", "#F6BB42", "#37BC9B", "#8CC152", "#967ADC"],
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -5,
            style: {
              fontSize: "12px",
              fontWeight: "bold",
              colors: ["#ffffff"],
            },
          },
        },
      },
      dataLabels: {
        formatter(val: number, opts: any) {
          const name = opts.w.globals.labels[opts.seriesIndex];
          return [name, `${val.toFixed(1)}%`];
        },
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
      },
    }),
    [orderStatusData],
  );
  return (
    <Card title="Tình trạng đơn hàng" style={style} loading={loading}>
      <ReactApexChart
        options={orderStatusChartOptions as ApexOptions}
        series={orderStatusData.series}
        type="pie"
      />
    </Card>
  );
};
