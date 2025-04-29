import { type HttpError, useGo, useNavigation, useTranslate } from "@refinedev/core";
import { useSimpleList } from "@refinedev/antd";
import type { IPlan } from "../../../interfaces";
import { Card, Divider, Flex, List, Skeleton, Tag, Typography, theme, Space, Avatar } from "antd";
import { PaginationTotal } from "../../paginationTotal";
import {
  EyeOutlined,
  TagOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { useStyles } from "./styled";
import { useLocation, useNavigate } from "react-router";
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

  const statusOptions = ["Pending", "Ongoing", "Complete", "Cancel"];

  // Hàm lấy màu sắc cho trạng thái
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "blue";
      case "ongoing":
        return "green";
      case "complete":
        return "purple";
      case "cancel":
        return "red";
      default:
        return "default";
    }
  };

  // Hàm định dạng ngày tháng
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  const navigate = useNavigate();
  return (
    <>
      <Divider style={{ margin: "16px 0px" }} />
      <Flex
        wrap="nowrap"
        gap={12}
        style={{
          width: "100%",
          overflowX: "auto",
          paddingBottom: "8px",
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
        {statusOptions.map((status) => (
          <Tag
            key={status}
            color={
              statusFilters?.includes(status) ? getStatusColor(status.toLowerCase()) : undefined
            }
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
              onClick={() => {
                navigate(`${item?.id}`);
              }}
              hoverable
              bordered={false}
              className={styles.card}
              styles={{
                body: {
                  padding: 0,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                },
              }}
            >
              {/* Card Cover with View Button and Approval Badge */}
              <div className={styles.cardCover}>
                <Tag
                  onClick={() => {
                    return go({
                      to: `${showUrl("plans", item.id)}`,
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
                  {t("common.view", "View")}
                </Tag>
                <Tag
                  color={item.is_approved ? "success" : "error"}
                  className={styles.approvalTag}
                  icon={item.is_approved ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                >
                  {item.is_approved ? t("common.approved") : t("common.notApproved")}
                </Tag>
              </div>

              {/* Card Content */}
              <div className={styles.cardContent}>
                {/* Card Title & Status */}
                <Flex justify="space-between" align="center" className={styles.cardMeta}>
                  <Typography.Title
                    level={5}
                    ellipsis={{
                      rows: 1,
                      tooltip: item.plan_name,
                    }}
                    style={{ margin: 0 }}
                  >
                    {item.plan_name}
                  </Typography.Title>
                  <Tag color={getStatusColor(item.status)}>
                    {t(`plans.status.${item.status.toLowerCase()}`)}
                  </Tag>
                </Flex>

                {/* Description */}
                <Typography.Paragraph
                  ellipsis={{ rows: 2, tooltip: item.description }}
                  style={{ marginBottom: 12 }}
                >
                  {item.description}
                </Typography.Paragraph>

                {/* Land Info */}
                <div className={styles.infoRow}>
                  <EnvironmentOutlined className={styles.icon} />
                  <Typography.Text type="secondary" ellipsis>
                    {item.yield_name}
                  </Typography.Text>
                </div>

                {/* Plant & Expert Info */}
                <div className={styles.infoRow}>
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{ backgroundColor: token.colorPrimary }}
                  />
                  <Typography.Text type="secondary" ellipsis>
                    {item.plant_name} ({item.expert_name})
                  </Typography.Text>
                </div>

                {/* Card Footer - Dates & Estimated Product */}
                <Flex justify="space-between" align="center" className={styles.cardFooter}>
                  <Flex align="center" gap={8}>
                    <CalendarOutlined className={styles.icon} />
                    <span className={styles.dateRange}>
                      {formatDate(item.start_date)} - {formatDate(item.end_date)}
                    </span>
                  </Flex>
                  <NumberWithUnit value={item.estimated_product} unit={item.estimated_unit} />
                </Flex>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
