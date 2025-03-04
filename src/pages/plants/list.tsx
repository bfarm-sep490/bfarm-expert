import { useTranslate, getDefaultFilter, useNavigation, useGo } from "@refinedev/core";
import {
  CreateButton,
  EditButton,
  FilterDropdown,
  ImageField,
  List,
  useTable,
} from "@refinedev/antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Table, Typography, theme, InputNumber, Input, Tag, Switch } from "antd";
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
            {t("plants.actions.add", "Add Plant")}
          </CreateButton>,
        ]}
      >
        <Table
          {...tableProps}
          rowKey="id"
          scroll={{ x: "max-content", y: 55 * 10 }}
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
                ID #
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
                  placeholder={t("plants.filter.id.placeholder", "Plant ID")}
                />
              </FilterDropdown>
            )}
          />

          <Table.Column<IPlant>
            key="image"
            dataIndex="image_url"
            title={t("plants.fields.image.label", "Image")}
            render={(value) => (
              <ImageField
                style={{
                  width: "60px",
                  height: "40px",
                  objectFit: "cover",
                }}
                value={value}
              />
            )}
          />

          <Table.Column<IPlant>
            key="plant_name"
            dataIndex="plant_name"
            title={t("plants.fields.plant_name.label", "Plant Name")}
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
                <Input
                  placeholder={t("plants.filter.plant_name.placeholder", "Search plant name")}
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
                  {t("plants.fields.quantity.label", "Quantity")}
                </Typography.Text>
              );
            }}
            render={(value, record: IPlant) => (
              <Typography.Text
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {value} {record.unit}
              </Typography.Text>
            )}
          />

          <Table.Column
            dataIndex="description"
            key="description"
            title={t("plants.fields.description.label", "Description")}
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
                <Input
                  placeholder={t("plants.filter.description.placeholder", "Search description")}
                />
              </FilterDropdown>
            )}
          />

          <Table.Column<IPlant>
            dataIndex="is_available"
            key="is_available"
            title={t("plants.fields.is_available.label", "Available")}
            render={(value) => <Switch checked={value} disabled />}
          />

          <Table.Column<IPlant>
            key="temperature"
            title={t("plants.fields.temperature.label", "Temp (°C)")}
            render={(_, record) => {
              return (
                <Typography.Text>
                  {record.min_temp} - {record.max_temp}
                </Typography.Text>
              );
            }}
          />

          <Table.Column<IPlant>
            key="humidity"
            title={t("plants.fields.humidity.label", "Humidity (%)")}
            render={(_, record) => {
              return (
                <Typography.Text>
                  {record.min_humid} - {record.max_humid}
                </Typography.Text>
              );
            }}
          />

          <Table.Column<IPlant>
            dataIndex="gt_test_kit_color"
            key="gt_test_kit_color"
            title={t("plants.fields.gt_test_kit_color.label", "Test Kit Color")}
            render={(value) => {
              const color = value.toLowerCase().replace(/\s+/g, "");
              return <Tag color={color}>{value}</Tag>;
            }}
          />

          <Table.Column
            title={t("table.actions", "Actions")}
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
