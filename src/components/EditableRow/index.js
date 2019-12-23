/**
 * author     : jayguo
 * createTime : 2019-06-20 13:37
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select } from 'antd';
import debounce from 'lodash.debounce';

const EditableContext = React.createContext();
const { Option } = Select;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={ form }>
    <tr { ...props } />
  </EditableContext.Provider>
);

export const EditableFormRow = Form.create()(EditableRow);

function mapStateToProps(state) {
  const { loading } = state;
  return {
    loading,
  };
}

@connect(mapStateToProps)
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diseaseList: [],
    };
    this.handleChange = debounce(this.handleChange, 500);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('componentDidUpdate');
    console.log(JSON.stringify(prevState, null, 2));
    console.log(JSON.stringify(this.state, null, 2));
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  handleSave = e => {
    const { record } = this.props;
    record.id = e;
  };

  handleSearch = value => {
    this.fetchList(value);
    // this.setState({ value });
  };

  handleChange = value => {
    this.setState({ value });
  };

  renderCell = form => {
    const { diseaseList } = this.state;
    this.form = form;
    const { dataIndex, title } = this.props;
    return (
      <Form.Item>
        { form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${ title } 不能为空！.`,
            },
          ],
          initialValue: this.state.value,
        })(
          <Select
            style={ { width: '90%' } }
            showSearch
            placeholder="请搜索病种"
            defaultActiveFirstOption={ false }
            showArrow={ false }
            filterOption={ false }
            onSearch={ this.handleSearch }
            // onChange={ this.handleChange }
            onSelect={ this.handleSave }
            notFoundContent={ null }
          >
            { diseaseList.map(o => (
              <Option key={ o.id } value={ o.id }>
                { o.name }
              </Option>
            )) }
          </Select>,
        ) }
      </Form.Item>
    );
  };

  fetchList(name) {
    const { dispatch } = this.props;
    const param = {
      pageNo: 1,
      pageSize: 999,
      name,
    };
    dispatch({
      type: 'disease/fetchList',
      payload: param,
    })
    //   .then(result => {
    //   if (result) {
    //     this.setState({
    //       diseaseList: result.data.rows,
    //     });
    //   }
    // });
  }

  render() {
    const { editable, children, ...restProps } = this.props;
    return <td { ...restProps }>{ editable ?
      <EditableContext.Consumer>{ this.renderCell }</EditableContext.Consumer> : children }</td>;
  }
}

export default App;
