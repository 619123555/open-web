import {Table} from 'antd';

export default class ShowList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          data: []
        };
    }
    render() {
        const columns = [
            {
              title: '业务',
              dataIndex: 'msgType',
              key: 'msgType',
                width: '10%',
                render: (text, record, index) => {
                  if (this.props.sta.Common_bussies != null
                      && this.props.sta.Common_bussies != '') {
                    this.props.sta.Common_bussies.forEach(function (val) {
                      if (val.value == text) {
                        text = val.label;
                      }
                    });
                    return text;
                  }
                }
            },
            {
              title: '告警原因',
              dataIndex: 'message',
              key: 'message',
                render: (text, record, index) => {
                    return text;
                }
            }, {
            title: '发生时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: '15%',
                render: (text, record, index) => {
                    return text;
                }
            }, {
            title: '是否确认',
            dataIndex: 'msgStatus',
            key: 'msgStatus',
            width: '10%',
                render: (text, record, index) => {
                  return <span>{this.props.sta.userNo != 'admin' ? (text == 0
                      ? '待确认' : '已处理') : (
                      <a href="javascript:;"
                         onClick={this.props.onConfirmWran.bind(
                             this,
                             record.id)}>{text == 0 ? '待确认' : '已处理'}</a>)}
                  </span>;
                }
            }
        ];

      return (
            <div>
              <Table rowKey={'id'} columns={columns} size={'small'}
                     setState={this.setState.bind(this)}
                     dataSource={this.props.sta.data}
                     pagination={false}/>
            </div>
        )
    }
}