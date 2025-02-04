import { Row, Col, theme, Dropdown, type MenuProps, Button, Flex } from "antd";
import { useTranslation } from "react-i18next";
import {
  CardWithPlot,
  QuickStatsChart,
} from "../../components";
import {
  DownOutlined,
  RiseOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { List, NumberField } from "@refinedev/antd";
import { useApiUrl, useCustom } from "@refinedev/core";
import dayjs from "dayjs";
import {
  IQuickStatsEntry,
} from "../../interfaces";

type DateFilter = "lastWeek" | "lastMonth";

const DATE_FILTERS: Record<
  DateFilter,
  {
    text: string;
    value: DateFilter;
  }
> = {
  lastWeek: {
    text: "lastWeek",
    value: "lastWeek",
  },
  lastMonth: {
    text: "lastMonth",
    value: "lastMonth",
  },
};

export const DashboardPage: React.FC = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const API_URL = useApiUrl();

  const [selecetedDateFilter, setSelectedDateFilter] = useState<DateFilter>(
    DATE_FILTERS.lastWeek.value
  );

  const dateFilters: MenuProps["items"] = useMemo(() => {
    const filters = Object.keys(DATE_FILTERS) as DateFilter[];

    return filters.map((filter) => {
      return {
        key: DATE_FILTERS[filter].value,
        label: t(`dashboard.filter.date.${DATE_FILTERS[filter].text}`),
        onClick: () => {
          setSelectedDateFilter(DATE_FILTERS[filter].value);
        },
      };
    });
  }, []);

  const dateFilterQuery = useMemo(() => {
    const now = dayjs();
    switch (selecetedDateFilter) {
      case "lastWeek":
        return {
          start: now.subtract(6, "days").startOf("day").format(),
          end: now.endOf("day").format(),
        };
      case "lastMonth":
        return {
          start: now.subtract(1, "month").startOf("day").format(),
          end: now.endOf("day").format(),
        };
      default:
        return {
          start: now.subtract(7, "days").startOf("day").format(),
          end: now.endOf("day").format(),
        };
    }
  }, [selecetedDateFilter]);

  const { data: quickStatsData } = useCustom<{
    data: IQuickStatsEntry[];
    total: number;
    trend: number;
  }>({
    url: `${API_URL}/quick-stats`,
    method: "get",
    config: {
      query: dateFilterQuery,
    },
  });

  const quick = useMemo(() => {
    const data = quickStatsData?.data?.data;
    if (!data) return { data: [], trend: 0 };

    const plotData = data.map((order) => {
      return {
        timeText: order.stat_name,
        value: order.value,
        state: order.description,
      };
    });

    return {
      data: plotData,
      trend: quickStatsData?.data?.trend || 0,
    };
  }, [quickStatsData]);

  return (
    <List
      title={t("dashboard.overview.title")}
      headerButtons={() => (
        <Dropdown menu={{ items: dateFilters }}>
          <Button>
            {t(
              `dashboard.filter.date.${DATE_FILTERS[selecetedDateFilter].text}`
            )}
            <DownOutlined />
          </Button>
        </Dropdown>
      )}
    >
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 12 }} lg={12} md={24} sm={24} xs={24}>
              <CardWithPlot
                icon={
                  <ShoppingOutlined
                    style={{
                      fontSize: 14,
                      color: token.colorPrimary,
                    }}
                  />
                }
                rightSlot={
                  <Flex align="center" gap={8}>
                    <NumberField value={quick.trend} />
                    {quick.trend > 0 ? <RiseOutlined /> : <DownOutlined />}
                  </Flex>
                }
                title={t("dashboard.quickStats.title")}
              >
                <QuickStatsChart height={170} data={quick.data} />
              </CardWithPlot>
            </Col>
            <Col xl={{ span: 12 }} lg={12} md={24} sm={24} xs={24}>
              <CardWithPlot
                icon={
                  <ShoppingOutlined
                    style={{
                      fontSize: 14,
                      color: token.colorPrimary,
                    }}
                  />
                }
                rightSlot={
                  <Flex align="center" gap={8}>
                    <NumberField value={quick.trend} />
                    {quick.trend > 0 ? <RiseOutlined /> : <DownOutlined />}
                  </Flex>
                }
                title={t("dashboard.quickStats.title")}
              >
                <QuickStatsChart height={170} data={quick.data} />
              </CardWithPlot>
            </Col>
          </Row>
        </Col>
      </Row>
    </List>
  );
};
