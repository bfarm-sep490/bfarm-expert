import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Empty, Spin, Typography } from "antd";

type PackagingProductProps = {
  packaging_products: any[];
  orders: any[];
  packaging_types: any[];
  refetch?: () => void;
  visible?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
};

export const PackagingProductDashBoard = ({
  packaging_products,
  packaging_types,
  loading,
  style,
  orders,
}: PackagingProductProps) => {
  const [chartLoading, setChartLoading] = useState(false);

  const processedData = React.useMemo(() => {
    if (!packaging_types?.length) return [];

    return packaging_types
      .map((type) => {
        const relatedOrders =
          orders?.filter((order) => order.packaging_type_id === type.id) || [];
        const estimatedQuantity = relatedOrders.reduce(
          (sum, order) => sum + (Number(order.preorder_quantity) || 0),
          0
        );

        const relatedProducts =
          packaging_products?.filter(
            (product) => product.packaging_type_id === type.id
          ) || [];

        const actualQuantity = relatedProducts.reduce(
          (sum, product) =>
            sum +
            (Number(product.quantity_per_pack) || 0) *
              (Number(product.pack_quantity) || 0),
          0
        );

        const percentage =
          estimatedQuantity > 0
            ? Math.round((actualQuantity / estimatedQuantity) * 100)
            : 0;

        return {
          id: type.id,
          name: type.name || `Loại ${type.id}`,
          estimated: estimatedQuantity,
          actual: actualQuantity,
          percentage: percentage > 100 ? 100 : percentage, 
        };
      })
      .filter((item) => item.estimated > 0 || item.actual > 0);
  }, [packaging_types, orders, packaging_products]);

  const chartData = React.useMemo(() => {
    const topData = [...processedData]
      .sort((a, b) => b.estimated + b.actual - (a.estimated + a.actual))
      .slice(0, 5);

    const series = topData.map((item) => item.percentage);
    const labels = topData.map((item) => item.name);

    return {
      series,
      options: {
        chart: {
          height: 350,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: "14px",
                fontWeight: 600,
                offsetY: -10,
              },
              value: {
                fontSize: "16px",
                formatter(val: string) {
                  return val + "%";
                },
              },
              total: {
                show: true,
                label: "Tổng",
                formatter(w: {
                  globals: { seriesTotals: any[]; series: string | any[] };
                }) {
                  if (w.globals.seriesTotals.length === 0) return "0%";
                  const total =
                    w.globals.seriesTotals.reduce((a, b) => a + b, 0) /
                    w.globals.series.length;
                  return Math.round(total) + "%";
                },
              },
            },
            hollow: {
              size: "40%",
            },
            track: {
              background: "#f2f2f2",
              strokeWidth: "80%",
              margin: 5,
            },
          },
        },
        labels,
        colors: ["#00E396", "#0090FF", "#FF4560", "#775DD0", "#FEB019"],
        tooltip: {
          enabled: true,
          y: {
            formatter(val: any, opts: { seriesIndex: any }) {
              const dataIndex = opts.seriesIndex;
              const item = topData[dataIndex];
              return `Thực tế: ${item.actual}kg / Dự kiến: ${item.estimated}kg`;
            },
          },
        },
        stroke: {
          lineCap: "round",
        },
      },
    };
  }, [processedData]);

  useEffect(() => {
    setChartLoading(true);
    const timer = setTimeout(() => {
      setChartLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [packaging_products, orders]);

  if (loading || chartLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          ...style,
        }}
      >
        <Spin />
      </div>
    );
  }

  if (!processedData.length) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          ...style,
        }}
      >
        <Empty description="Không có dữ liệu" />
      </div>
    );
  }

  return (
    <div style={{ ...style }}>
      <ReactApexChart
        options={chartData.options as unknown as ApexOptions}
        series={chartData.series}
        type="radialBar"
        height={200}
        width="100%"
      />
      {chartData.series.length === 0 && (
        <Typography.Text style={{ display: "block", textAlign: "center" }}>
          Không có dữ liệu để hiển thị
        </Typography.Text>
      )}
    </div>
  );
};

export default PackagingProductDashBoard;
