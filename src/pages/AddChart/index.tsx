import { genChartByAIUsingPOST } from '@/services/intelliBI/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * Add Chart Page
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BIResponse>();
  const [option, setOption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);

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
    setChart(undefined);
    setOption(undefined);
    // Send Request to back-end
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAIUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('Analysis failed.');
      } else {
        message.success('Analysis successful.');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('Chart code is wrong.')
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('Analysis failed，' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart">
      <Row gutter={18}>
        <Col span={12}>
          <Card title="AI Data Analysis">
            <Form name="addChart" labelAlign="left" labelCol={{ span: 7 }}
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
                  <Button htmlType="reset">Reset</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Analysis Result">
            {chart?.genResult ?? <div>Please submit your data first</div>}
            <Spin spinning={submitting}/>
          </Card>
          <Divider />
          <Card title="Visualization Charts">
          {
              option ? <ReactECharts option={option} /> : <div>Please submit your data first</div>
            }
            <Spin spinning={submitting}/>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
