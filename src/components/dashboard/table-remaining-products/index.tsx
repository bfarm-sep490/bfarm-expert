import { Card, Table, Typography } from "antd";
import { useMemo } from "react";
type RemainingProps = {
  orderData: any;
  plantData: any;
  packagingProductData: any;
  harvestingProductData: any;
  loading?: boolean;
  style?: React.CSSProperties;
};
export const RemainingProductsTable = ({
  orderData,
  plantData,
  packagingProductData,
  harvestingProductData,
  loading,
  style,
}: RemainingProps) => {
  const remainingProducts = useMemo(() => {
    return (
      plantData?.data?.map((plant: any) => {
        const harvestingProducts =
          harvestingProductData?.data?.filter(
            (product: any) => product.plant_id === plant.id && product.status !== "OutOfStock",
          ) || [];

        const packagingProducts =
          packagingProductData?.data?.filter(
            (product: any) => product.plant_id === plant.id && product.status === "Active",
          ) || [];

        const totalHarvestingQuantity = harvestingProducts.reduce(
          (sum: any, product: any) => sum + (product.harvesting_quantity || 0),
          0,
        );

        const availableHarvestingQuantity = harvestingProducts.reduce(
          (sum: any, product: any) => sum + (product.available_harvesting_quantity || 0),
          0,
        );

        const totalPackagingPacks = packagingProducts.reduce(
          (sum: any, product: any) => sum + product.total_packs,
          0,
        );

        const availablePackagingPacks = packagingProducts.reduce(
          (sum: any, product: any) => sum + product.available_packs,
          0,
        );

        return {
          plant_id: plant.id,
          plant_name: plant.plant_name,
          total_harvesting_quantity: totalHarvestingQuantity,
          available_harvesting_quantity: availableHarvestingQuantity,
          total_packaging_packs: totalPackagingPacks,
          available_packaging_packs: availablePackagingPacks,
        };
      }) || []
    );
  }, [plantData, harvestingProductData, packagingProductData]);
  const productYieldColumns = [
    {
      title: "Loại Cây Trồng",
      dataIndex: "plant_name",
      key: "plant_name",
      render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: "Tổng Sản Lượng (kg)",
      dataIndex: "total_harvesting_quantity",
      key: "total_harvesting_quantity",
      render: (value: number) => <Typography.Text>{value.toFixed(2)} kg</Typography.Text>,
      sorter: (a: any, b: any) => a.total_harvesting_quantity - b.total_harvesting_quantity,
    },
    {
      title: "Sản Lượng Khả Dụng (kg)",
      dataIndex: "available_harvesting_quantity",
      key: "available_harvesting_quantity",
      render: (value: number) => (
        <Typography.Text type={value > 0 ? "success" : "danger"}>
          {value.toFixed(2)} kg
        </Typography.Text>
      ),
      sorter: (a: any, b: any) => a.available_harvesting_quantity - b.available_harvesting_quantity,
    },
    {
      title: "Tổng Gói",
      dataIndex: "total_packaging_packs",
      key: "total_packaging_packs",
      render: (value: number) => <Typography.Text>{value} gói</Typography.Text>,
      sorter: (a: any, b: any) => a.total_packaging_packs - b.total_packaging_packs,
    },
    {
      title: "Gói Khả Dụng",
      dataIndex: "available_packaging_packs",
      key: "available_packaging_packs",
      render: (value: number) => (
        <Typography.Text type={value > 0 ? "success" : "danger"}>{value} gói</Typography.Text>
      ),
      sorter: (a: any, b: any) => a.available_packaging_packs - b.available_packaging_packs,
    },
  ];
  return (
    <Card style={style} title="Thành phẩm và sản lượng còn lại" loading={loading}>
      <Table
        columns={productYieldColumns}
        dataSource={remainingProducts}
        pagination={{
          pageSize: 5,
        }}
      />
    </Card>
  );
};
