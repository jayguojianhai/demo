/**
 * author     : jayguo
 * createTime : 2019-06-19 14:19
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Spin, Table, Row, Col } from 'antd';
import EditableCell, { EditableFormRow } from '../components/EditableRow';


function mapStateToProps(state) {
  const { loading } = state;
  return { loading };
}

@connect(mapStateToProps)
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    };
  }

  handleAdd = () => {
    const data = this.state.dataSource;
    const newData = {
      isNew: true,
    };
    this.setState({
      dataSource: [...data, newData],
    });
  };

  render() {
    const { loading } = this.props;
    const data = this.state.dataSource;
    let columns = [
      {
        title: '名称',
        dataIndex: 'tag_name',
        editable: true,
      },
    ];
    columns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: record.isNew ? col.editable : false,
          dataIndex: col.dataIndex,
          title: col.title,
          // handleSave: this.handleSave,
        }),
      };
    });
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    return (
      <Spin spinning={!!loading.effects['patient/fetchInfo'] || !!loading.effects['patient/fetchMakeInfo']}>
        <Row className="module-title">
          <Col span={12}>
            <h3>标注</h3>
          </Col>
          <Col span={12} className="text-right">
            {data.findIndex(o => o.isNew) < 0 ? ( // 一次只能增加一个
              <Button size="small" onClick={this.handleAdd}>
                添加标注
              </Button>
            ) : null}
          </Col>
        </Row>
        <Table
          rowKey="id"
          components={components}
          columns={columns}
          dataSource={data}
          pagination={false}
          size="middle"
          loading={
            !!loading.effects['disease/fetchList']
          }
        />
      </Spin>
    );
  }
}

export default App;
