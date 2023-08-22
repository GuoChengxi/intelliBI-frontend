import {genChartByAiAsyncUsingPOST} from '@/services/intelliBI/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {Button, Card, Form, Input, message, Select, Space, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import {useForm} from "antd/es/form/Form";

/**
 * Add Chart Page
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  /**
   * Submit
   * @param values
   */
  const onFinish = async (values: any) => {
    // Avoid repeated submission
    if (submitting) {
      return;
    }
    setSubmitting(true);

    // Send Request to back-end
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiAsyncUsingPOST(params, {}, values.file.file.originFileObj);
      // const res = await genChartByAIUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('Analysis failed. Operations may be too frequent.');
      } else {
        console.log(res);
        message.success('Analysis submitted successfully. Please view at \'My Chart\' page later.');
      }
    } catch (e: any) {
      message.error('Analysis failed，' + e.message);
    }
    setSubmitting(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div className="add-chart">
      <Card title="AI Data Analysis">
        <Form form={form} name="addChart" labelAlign="left" labelCol={{ span: 7 }}
              wrapperCol={{ span: 16 }} onFinish={onFinish} initialValues={{}}>
          <Form.Item
            name="goal"
            label="Analysis Goal"
            rules={[{ required: true, message: 'Please enter analysis goal: ' }]}
          >
            <TextArea placeholder="e.g. Analyze the user growth data of this website" />
          </Form.Item>
          <Form.Item name="name" label="Chart Name">
            <Input placeholder="Please enter chart name" />
          </Form.Item>
          <Form.Item name="chartType" label="Chart Type">
            <Select
              options={[
                { value: 'line', label: 'Line Chart' },
                { value: 'bar', label: 'Bar Chart' },
                { value: 'stacked', label: 'Stacked Chart' },
                { value: 'pie', label: 'Pie Chart' },
                { value: 'radar', label: 'Radar Chart' }
              ]}
            />
          </Form.Item>
          <Form.Item name="file" label="Raw Data">
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload Excel File</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16, offset: 7 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                Submit
              </Button>
              <Button htmlType="reset" onClick={onReset}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartAsync;
