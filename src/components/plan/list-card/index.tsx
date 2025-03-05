import { type HttpError, useGo, useList, useNavigation, useTranslate } from "@refinedev/core";
import { useSimpleList } from "@refinedev/antd";
import type { IPlan, IPlant } from "../../../interfaces";
import { Card, Divider, Flex, List, Skeleton, Tag, Typography, theme } from "antd";
import { PlanStatus } from "../status";
import { PaginationTotal } from "../../paginationTotal";
import { EyeOutlined, TagOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { useStyles } from "./styled";
import { useLocation } from "react-router";
import { NumberWithUnit } from "../number-with-unit";

export const PlanListCard = () => {
  const { styles, cx } = useStyles();
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const {
    listProps: planListProps,
    filters,
    setFilters,
  } = useSimpleList<IPlan, HttpError>({
    pagination: {
      current: 1,
      pageSize: 12,
    },
    filters: {
      initial: [
        {
          field: "status",
          operator: "in",
          value: [],
        },
      ],
    },
  });

  const { data: plantData, isLoading: plantIsLoading } = useList<IPlant, HttpError>({
    resource: "plants",
    pagination: {
      mode: "off",
    },
  });
  const plants = plantData?.data || [];

  const statusFilters = useMemo(() => {
    const filter = filters.find((filter) => {
      if ("field" in filter) {
        return filter.field === "status";
      }
      return false;
    });

    return {
      operator: filter?.operator || "in",
      value: (filter?.value || []) as string[],
    };
  }, [filters]).value;

  const hasStatusFilter = statusFilters?.length > 0;

  const handleOnTagClick = (status: string) => {
    const newFilters = [...statusFilters];
    const hasCurrentFilter = newFilters.includes(status);
    if (hasCurrentFilter) {
      newFilters.splice(newFilters.indexOf(status), 1);
    } else {
      newFilters.push(status);
    }

    setFilters([
      {
        field: "status",
        operator: "in",
        value: newFilters,
      },
    ]);
  };

  const statusOptions = ["Pending", "Ongoing", "Completed", "Cancelled"];

  return (
    <>
      <Divider style={{ margin: "16px 0px" }} />
      <Flex
        wrap="nowrap"
        gap={12}
        style={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Tag
          style={{ padding: "4px 10px 4px 10px", cursor: "pointer" }}
          color={!hasStatusFilter ? token.colorPrimary : undefined}
          icon={<TagOutlined />}
          onClick={() => {
            setFilters([
              {
                field: "status",
                operator: "in",
                value: [],
              },
            ]);
          }}
        >
          {t("plans.filter.allStatus.label", "All Status")}
        </Tag>
        {!plantIsLoading &&
          statusOptions.map((status) => (
            <Tag
              key={status}
              color={statusFilters?.includes(status) ? "orange" : undefined}
              style={{
                padding: "4px 10px 4px 10px",
                cursor: "pointer",
              }}
              onClick={() => {
                handleOnTagClick(status);
              }}
            >
              {t(`plans.status.${status.toLowerCase()}`)}
            </Tag>
          ))}

        {plantIsLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton.Button
              key={index}
              style={{
                width: "108px",
                height: "30px",
              }}
              active
            />
          ))}
      </Flex>
      <Divider style={{ margin: "16px 0px" }} />
      <List
        {...planListProps}
        pagination={{
          ...planListProps.pagination,
          showTotal: (total) => <PaginationTotal total={total} entityName={"plan"} />,
        }}
        grid={{
          gutter: [16, 16],
          column: 4,
          xxl: 4,
          xl: 4,
          lg: 3,
          md: 2,
          sm: 1,
          xs: 1,
        }}
        renderItem={(item) => (
          <List.Item style={{ height: "100%" }}>
            <Card
              hoverable
              bordered={false}
              className={styles.card}
              styles={{
                body: {
                  padding: 16,
                },
                cover: {
                  position: "relative",
                },
                actions: {
                  marginTop: "auto",
                },
              }}
              cover={
                <Tag
                  onClick={() => {
                    return go({
                      to: `${showUrl("plan", item.id)}`,
                      query: {
                        to: pathname,
                      },
                      options: {
                        keepQuery: true,
                      },
                      type: "replace",
                    });
                  }}
                  className={cx(styles.viewButton, "viewButton")}
                  icon={<EyeOutlined />}
                >
                  View
                </Tag>
              }
              actions={[
                <Flex
                  key="actions"
                  justify="space-between"
                  style={{
                    padding: "0 16px",
                  }}
                >
                  <Typography.Text key="plant.name">
                    {plants.find((plant) => plant.id === item.plant_id)?.plant_name}
                  </Typography.Text>
                  <PlanStatus key="status" value={item.status} />
                </Flex>,
              ]}
            >
              <Card.Meta
                title={
                  <Flex>
                    <Typography.Title
                      level={5}
                      ellipsis={{
                        rows: 1,
                        tooltip: item.plan_name,
                      }}
                    >
                      {item.plan_name}
                    </Typography.Title>
                    <NumberWithUnit value={item.estimated_product} unit={item.estimated_unit} />
                  </Flex>
                }
                description={
                  <Typography.Paragraph ellipsis={{ rows: 2, tooltip: item.description }}>
                    {item.description}
                  </Typography.Paragraph>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
