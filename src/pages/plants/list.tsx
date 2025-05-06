import { useTranslate, getDefaultFilter, useNavigation, useGo } from "@refinedev/core";
import {
  CreateButton,
  EditButton,
  FilterDropdown,
  ImageField,
  List,
  useTable,
} from "@refinedev/antd";
import { EyeOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { Table, Typography, theme, InputNumber, Input, Tag, Select } from "antd";
import type { IPlant } from "../../interfaces";
import { PaginationTotal } from "../../components";
import { useLocation } from "react-router";
import type { PropsWithChildren } from "react";

export const PlantList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();

  const { tableProps, filters } = useTable<IPlant>({
    filters: {
      initial: [
        {
          field: "plant_name",
          operator: "contains",
          value: "",
        },
        {
          field: "description",
          operator: "contains",
          value: "",
        },
      ],
    },
  });

  // Hàm lấy màu sắc cho tag status
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "success";
      case "in-use":
        return "processing";
      case "maintenance":
        return "warning";
      default:
        return "default";
    }
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  return (
    <>
      <List
        breadcrumb={false}
        headerButtons={(props) => [
          <CreateButton
            {...props.createButtonProps}
            key="create"
            size="large"
            onClick={() => {
              return go({
                to: `${createUrl("plants")}`,
                query: {
                  to: pathname,
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          >
            {t("plants.actions.add")}
          </CreateButton>,
        ]}
      >
        <Table
          {...tableProps}
          rowKey="id"
          scroll={{ x: true }}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => <PaginationTotal total={total} entityName="plants" />,
          }}
        >
          <Table.Column
            title={
              <Typography.Text
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {t("plants.fields.id.label")}
              </Typography.Text>
            }
            dataIndex="id"
            key="id"
            width={80}
            render={(value) => (
              <Typography.Text
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                #{value}
              </Typography.Text>
            )}
            filterIcon={(filtered) => (
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
            defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <InputNumber
                  addonBefore="#"
                  style={{ width: "100%" }}
                  placeholder={t("plants.filter.id.placeholder")}
                />
              </FilterDropdown>
            )}
          />

          <Table.Column<IPlant>
            key="image"
            dataIndex="image_url"
            title={t("plants.fields.image.label")}
            render={(value) => (
              <ImageField
                style={{
                  width: "50px",
                  height: "30px",
                  objectFit: "cover",
                }}
                value={value}
              />
            )}
          />

          <Table.Column<IPlant>
            key="plant_name"
            dataIndex="plant_name"
            title={t("plants.fields.name.label")}
            filterIcon={(filtered) => (
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
            defaultFilteredValue={getDefaultFilter("plant_name", filters, "contains")}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder={t("plants.filter.plant_name.placeholder")} />
              </FilterDropdown>
            )}
          />

          <Table.Column<IPlant>
            key="type"
            dataIndex="type"
            title={t("plants.fields.type.label")}
            filterIcon={(filtered) => (
              <FilterOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
            defaultFilteredValue={getDefaultFilter("type", filters, "eq")}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: "100%" }}
                  placeholder={t("plants.filter.type.placeholder")}
                  options={[
                    { value: "Rau lá", label: t("plants.types.vegetable") },
                    { value: "Củ", label: t("plants.types.root") },
                    { value: "Quả", label: t("plants.types.fruit") },
                    { value: "Gia vị", label: t("plants.types.spice") },
                  ]}
                />
              </FilterDropdown>
            )}
          />

          <Table.Column
            key="quantity"
            dataIndex="quantity"
            title={() => {
              return (
                <Typography.Text
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("plants.fields.quantity.label")}
                </Typography.Text>
              );
            }}
            render={(value) => (
              <Typography.Text
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {value}
              </Typography.Text>
            )}
          />

          <Table.Column
            dataIndex="description"
            key="description"
            title={t("plants.fields.description.label")}
            ellipsis={true}
            filterIcon={(filtered) => (
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
            defaultFilteredValue={getDefaultFilter("description", filters, "contains")}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder={t("plants.filter.description.placeholder")} />
              </FilterDropdown>
            )}
          />

          <Table.Column<IPlant>
            dataIndex="status"
            key="status"
            title={t("plants.fields.status.label")}
            render={(value) => (
              <Tag color={getStatusColor(value)}>{value || t("plants.noStatus")}</Tag>
            )}
            filterIcon={(filtered) => (
              <FilterOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
            defaultFilteredValue={getDefaultFilter("status", filters, "eq")}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: "100%" }}
                  placeholder={t("plants.filter.status.placeholder")}
                  options={[
                    { value: "Available", label: t("plants.status.available") },
                    { value: "In-Use", label: t("plants.status.inUse") },
                    { value: "Maintenance", label: t("plants.status.maintenance") },
                  ]}
                />
              </FilterDropdown>
            )}
          />

          <Table.Column<IPlant>
            key="base_price"
            dataIndex="base_price"
            title={t("plants.fields.basePrice.label")}
            render={(value) => <Typography.Text>{formatCurrency(value)}</Typography.Text>}
          />

          <Table.Column<IPlant>
            key="preservation"
            dataIndex="preservation_day"
            title={t("plants.fields.preservationDays.label")}
            render={(value) => (
              <Typography.Text>
                {value} {t("plants.days")}
              </Typography.Text>
            )}
          />

          <Table.Column
            title={t("table.actions")}
            key="actions"
            fixed="right"
            align="center"
            render={(_, record: IPlant) => {
              return <EditButton icon={<EyeOutlined />} hideText recordItemId={record.id} />;
            }}
          />
        </Table>
      </List>
      {children}
    </>
  );
};
