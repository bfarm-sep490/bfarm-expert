import { StatusTag } from "@/components/caring-task/status-tag";
import { DateField } from "@refinedev/antd";
import { Card, Typography, Image, Flex, Progress, Empty, theme } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router";
type PlanTrackingProps = {
  plansData: any;
  plantData: any;
  loading?: boolean;
  style?: React.CSSProperties;
};
export const DashboardPlanTracking = ({
  plansData,
  plantData,
  loading,
  style,
}: PlanTrackingProps) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  return (
    <Card
      loading={loading}
      style={style}
      title="Kế hoạch đang triển khai"
      headStyle={{
        fontWeight: "600",
        fontSize: "16px",
      }}
    >
      {(plansData?.data?.filter((plan: any) => plan?.status === "Ongoing")?.length ?? 0) > 0 ? (
        <div
          id="scrollablePlanDiv"
          style={{
            height: 400,
            overflow: "auto",
            padding: "4px 2px",
          }}
        >
          <InfiniteScroll
            dataLength={plansData?.data?.length || 0}
            next={() => {}}
            hasMore={false}
            loader={
              <Typography.Text
                type="secondary"
                style={{
                  padding: "10px",
                  display: "block",
                  textAlign: "center",
                }}
              >
                Đang tải...
              </Typography.Text>
            }
            scrollableTarget="scrollablePlanDiv"
          >
            {plansData?.data
              ?.filter((plan: any) => plan?.status === "Ongoing")
              .map((plan: any) => {
                const start = new Date(plan.start_date);
                const end = new Date(plan.end_date);
                const now = new Date();

                const total = end.getTime() - start.getTime();
                const passed = now.getTime() - start.getTime();
                const percent = Math.min(100, Math.max(0, (passed / total) * 100));

                const associatedPlant = plantData?.data?.find(
                  (plant: any) => plant.id === plan.plant_id,
                );

                const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24));
                const isNearlyComplete = percent > 80;

                return (
                  <Flex
                    onClick={() => {
                      navigate(`/plans/${plan.id}`);
                    }}
                    key={plan.id}
                    gap={16}
                    style={{
                      padding: "16px 14px",
                      borderRadius: 8,
                      background: token?.colorBgLayout,
                      marginBottom: 16,
                      border: "1px solid #f0f0f0",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.2s ease",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {associatedPlant?.image_url && (
                      <div style={{ flex: "0 0 200px" }}>
                        <Image
                          width={200}
                          height={150}
                          style={{
                            borderRadius: 8,
                            objectFit: "cover",
                            border: "1px solid #f0f0f0",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                          }}
                          src={associatedPlant.image_url}
                          alt={associatedPlant.plant_name}
                          preview={false}
                        />
                      </div>
                    )}
                    <Flex vertical gap={10} style={{ width: "100%" }}>
                      <Flex justify="space-between" align="center">
                        <Flex align="center" gap={8}>
                          <Typography.Text
                            style={{
                              margin: 0,
                              backgroundColor: "#f6f6f6",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "14px",
                              color: "#555",
                            }}
                          >
                            #{plan.id}
                          </Typography.Text>
                          <Typography.Title
                            level={5}
                            style={{
                              margin: 0,
                              fontSize: "16px",
                            }}
                          >
                            {plan.plan_name}
                          </Typography.Title>
                        </Flex>
                        <StatusTag status={plan.status} />
                      </Flex>

                      <Flex wrap="wrap" gap="24px 16px">
                        <Flex vertical gap={4} style={{ minWidth: "45%" }}>
                          <Typography.Text type="secondary" style={{ fontSize: "13px" }}>
                            Khu đất
                          </Typography.Text>
                          <Typography.Text strong>{plan.yield_name || "N/A"}</Typography.Text>
                        </Flex>

                        <Flex vertical gap={4} style={{ minWidth: "45%" }}>
                          <Typography.Text type="secondary" style={{ fontSize: "13px" }}>
                            Cây trồng
                          </Typography.Text>
                          <Typography.Text strong>
                            {associatedPlant?.plant_name || "N/A"}
                          </Typography.Text>
                        </Flex>
                      </Flex>

                      <Flex vertical gap={4}>
                        <Typography.Text type="secondary" style={{ fontSize: "13px" }}>
                          Thời gian
                        </Typography.Text>
                        <Flex align="center" gap={4}>
                          <DateField
                            value={plan.start_date}
                            format="HH:mm DD/MM/YYYY"
                            style={{ fontWeight: "500" }}
                          />
                          <Typography.Text style={{ color: "#999" }}>→</Typography.Text>
                          <DateField
                            value={plan.end_date}
                            format="HH:mm DD/MM/YYYY"
                            style={{ fontWeight: "500" }}
                          />
                          {daysLeft > 0 && (
                            <Typography.Text
                              style={{
                                fontSize: "11px",
                                padding: "1px 8px",
                                marginLeft: "8px",
                                borderRadius: "10px",
                                backgroundColor: daysLeft <= 3 ? "#ff4d4f" : "#52c41a",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              {daysLeft <= 3 ? `Còn ${daysLeft} ngày!` : `Còn ${daysLeft} ngày`}
                            </Typography.Text>
                          )}
                          {daysLeft === 0 && (
                            <Typography.Text
                              style={{
                                fontSize: "11px",
                                padding: "1px 8px",
                                marginLeft: "8px",
                                borderRadius: "10px",
                                backgroundColor: "#ff4d4f",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              Kết thúc hôm nay!
                            </Typography.Text>
                          )}
                          {daysLeft < 0 && (
                            <Typography.Text
                              style={{
                                fontSize: "11px",
                                padding: "1px 8px",
                                marginLeft: "8px",
                                borderRadius: "10px",
                                backgroundColor: "#faad14",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              Đã quá {Math.abs(daysLeft)} ngày
                            </Typography.Text>
                          )}
                        </Flex>
                      </Flex>

                      <div style={{ marginTop: "6px" }}>
                        <Flex
                          justify="space-between"
                          align="center"
                          style={{ marginBottom: "4px" }}
                        >
                          <Typography.Text
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: isNearlyComplete ? "#52c41a" : undefined,
                            }}
                          >
                            Tiến độ: {parseFloat(percent.toFixed(1))}%
                          </Typography.Text>
                          <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                            {passed > 0
                              ? `${Math.floor(passed / (1000 * 3600 * 24))} ngày đã qua`
                              : "Mới bắt đầu"}
                          </Typography.Text>
                        </Flex>
                        <Progress
                          percent={parseFloat(percent.toFixed(1))}
                          status={
                            plan.status === "Complete"
                              ? "success"
                              : plan.status === "Cancel"
                                ? "exception"
                                : "active"
                          }
                          strokeColor={
                            isNearlyComplete ? { from: "#52c41a", to: "#52c41a" } : undefined
                          }
                          size="small"
                        />
                      </div>
                    </Flex>
                  </Flex>
                );
              })}
          </InfiniteScroll>
        </div>
      ) : (
        <Empty description="Chưa có kế hoạch nào cho đơn hàng này" style={{ margin: "40px 0" }} />
      )}
    </Card>
  );
};
