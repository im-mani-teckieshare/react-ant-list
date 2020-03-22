import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { List, message, Avatar, Spin } from 'antd';

import reqwest from 'reqwest';

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
export default class UserList extends React.Component{

state = {
  dataList:[],
  loading: false
}

componentDidMount(){
  this.fetchData(res=> {
      this.setState({
        dataList: res.results,
      });
    });
}

fetchData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res);
      },
    });
  };

render(){
  const {dataList} = this.state;
return  (<List
    itemLayout="horizontal"
    dataSource={dataList}
    renderItem={item => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={item.name.last}
          description={item.email}
        />
      </List.Item>
    )}
  />)
}

}