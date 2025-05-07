import { useCreate, useList } from "@refinedev/core";
import { Modal, Form, Select, Button, Spin, InputNumber, Typography, Divider, Empty } from "antd";
import { useState, useEffect } from "react";

type Props = {
  api?: any;
  visible?: boolean;
  onClose?: () => void;
  id: number;
  refresh?: () => void;
  suggest_yields?: [];
};

export const AddSuitableModal = ({ api, visible, onClose, id, refresh, suggest_yields }: Props) => {
  const [form] = Form.useForm();
  const [selectedYield, setSelectedYield] = useState<number | null>(null);

  const { mutate, isLoading: isSubmitting } = useCreate({
    resource: "plants/suggest-yields",
  });

  const { data: yieldData, isLoading: yieldLoading } = useList({
    resource: "yields",
  });

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setSelectedYield(null);
    }
  }, [visible, form]);

  const nonSuggestedYields = () => {
    if (!yieldData?.data || !suggest_yields) return [];

    return yieldData?.data?.filter(
      (item: any) => !suggest_yields?.some((suggest: any) => suggest.id === item.id),
    );
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      mutate(
        {
          resource: `plants/${id}/suggest-yields`,
          values: {
            yield_id: selectedYield,
            maximum_quantity: values.maximum_quantity,
          },
        },
        {
          onSuccess: () => {
            api?.success({
              message: "Thêm đất phù hợp thành công",
            });
            if (refresh) refresh();
            if (onClose) onClose();
          },
          onError: (error) => {
            api?.error({
              message: "Thêm đất phù hợp thất bại",
              description: error.message,
            });
          },
        },
      );
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const hasNonSuggestedYields = nonSuggestedYields().length > 0;

  return (
    <Modal
      title="Thêm đất phù hợp"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
          disabled={!selectedYield}
        >
          Lưu
        </Button>,
      ]}
    >
      <Spin spinning={yieldLoading || isSubmitting}>
        <Form form={form} layout="vertical">
          <Typography.Text>
            Chọn đất phù hợp khác (không nằm trong danh sách gợi ý) cho cây trồng này:
          </Typography.Text>

          <Divider />

          {hasNonSuggestedYields ? (
            <>
              <Form.Item name="yield_id" label="Chọn đất trồng khác">
                <Select
                  placeholder="Chọn đất trồng không nằm trong danh sách gợi ý"
                  onChange={(value) => setSelectedYield(value)}
                  style={{ width: "100%" }}
                  optionFilterProp="children"
                  showSearch
                  options={nonSuggestedYields().map((item: any) => ({
                    value: item.id,
                    label: `${item.yield_name} (${item.area} ${item.area_unit}) - ${item.type}`,
                  }))}
                  notFoundContent={
                    yieldLoading ? <Spin size="small" /> : "Không tìm thấy đất phù hợp"
                  }
                />
              </Form.Item>

              <Form.Item
                name="maximum_quantity"
                label="Ước tính năng suất (kg/m²)"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ước tính năng suất",
                  },
                ]}
              >
                <InputNumber
                  min={0.1}
                  step={0.1}
                  style={{ width: "100%" }}
                  placeholder="Nhập ước tính năng suất trên 1m²"
                  addonAfter="kg/m²"
                />
              </Form.Item>
            </>
          ) : (
            <Empty
              description="Tất cả đất đã được thêm vào danh sách gợi ý"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Form>
      </Spin>
    </Modal>
  );
};
