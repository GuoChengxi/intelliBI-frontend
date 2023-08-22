import {useEffect, useState} from "react";
import {useModel} from "@@/exports";
import {listMyChartByPageUsingPOST} from "@/services/intelliBI/chartController";
import {Avatar, Card, List, message, Result} from "antd";
import Search from "antd/es/input/Search";
import ReactECharts from "echarts-for-react";
import TaskStatus from "@/constants/taskStatus";
import {useNavigate} from "react-router-dom";

const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // hide chart's title
        if (res.data.records) {
          res.data.records.forEach(data => {
            if (data.status === TaskStatus.DONE) {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          })
        }
      } else {
        message.error('Failed to load my chart');
      }
    } catch (e: any) {
      message.error('Failed to load my chart, ' + e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [searchParams]);

  // function useEditChart(chart: API.Chart) {
  //     const navigate = useNavigate();
  //     navigate(`/edit_chart/${chart.id}`);
  // }

  return (
    <div className={"my-chart-page"}>
      <div>
        <Search placeholder="Please enter chart name" enterButton loading={loading} onSearch={(value) => {
          setSearchParams({
            ...initSearchParams,
            name: value,
          })
        }}/>
      </div>
      <div className="margin-16"/>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? 'Chart Type: ' + item.chartType : undefined}
              />
              <>
                {
                  item.status === TaskStatus.WAITING && <>
                    <Result
                      status="warning"
                      title="To be generated"
                      subTitle={item.execMessage ?? 'Chart generation queue is busy, please wait.'}
                    />
                  </>
                }
                {
                  item.status === TaskStatus.RUNNING && <>
                    <Result
                      status="info"
                      title="Chart generating..."
                      subTitle={item.execMessage}
                    />
                  </>
                }
                {
                  item.status === TaskStatus.DONE && <>
                    <div style={{ marginBottom: 16 }} />
                    <p>{'Analysis Goal：' + item.goal}</p>
                    <div style={{ marginBottom: 16 }} />
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
                  </>
                }
                {
                  item.status === TaskStatus.FAILED && <>
                    <Result
                      status="error"
                      title="Failed to generate chart."
                      subTitle={item.execMessage}
                    />
                  </>
                }
              </>
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
}

export default MyChartPage;
