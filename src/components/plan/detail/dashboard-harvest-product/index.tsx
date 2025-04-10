import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Button } from "antd";

type HarvestingProductProps = {
  quantity_available_harvesting_products: number;
  total_harvesting_products: number;
  refetch?: () => void;
  visible?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
};

export const HarvestingProductDashBoard = ({
  quantity_available_harvesting_products,
  total_harvesting_products,
  loading,
  refetch,
  style,
}: HarvestingProductProps) => {
  const [chartLoading, setChartLoading] = useState(false);
  const [state, setState] = useState({
    series: [
      total_harvesting_products > 0
        ? Math.round((quantity_available_harvesting_products / total_harvesting_products) * 100)
        : 0,
    ],
    options: {
      chart: {
        height: 150,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "100%",
          },
          track: {
            strokeWidth: "97%",
          },
          dataLabels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
            },
            value: {
              show: true,
              fontSize: "18px",
              color: "#00E396",
              fontWeight: "bold",
              formatter(val: number) {
                return val + "%";
              },
            },
          },
        },
      },
      fill: {
        colors: ["#00E396"],
      },
      labels: [`${quantity_available_harvesting_products} kg / ${total_harvesting_products} kg`],
    } as ApexOptions,
  });

  // Update chart when props change
  useEffect(() => {
    setState({
      series: [
        total_harvesting_products > 0
          ? Math.round(
              (quantity_available_harvesting_products /
                total_harvesting_products) *
                100
            )
          : 0,
      ],
      options: {
        ...state.options,
        labels: [
          `${quantity_available_harvesting_products} / ${total_harvesting_products}`,
        ],
      } as ApexOptions,
    });
  }, [quantity_available_harvesting_products, total_harvesting_products]);

  return (
    <ReactApexChart options={state.options} series={state.series} type="radialBar" height={150} />
  );
};

export default HarvestingProductDashBoard;
