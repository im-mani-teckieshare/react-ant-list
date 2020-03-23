import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { List, message, Avatar, Spin, Button, Icon,message } from 'antd';
import { SmallDashOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import reqwest from 'reqwest';

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
export default class UserListVirtualization extends React.Component{

state = {
  dataList:[],
  loading: true,
  loadMore: true
}

componentDidMount(){
  this.fetchData(res=> {
      this.setState({
        dataList: res.results,
        loading:false
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

renderItem = item => {
 return <List.Item>
        <List.Item.Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={item.name.last}
          description={item.email}
        />
      </List.Item>
}

onLoadMore = ()=>{
       message.warning('Infinite List loaded all');
       console.log('comes scroll')
  this.setState({
    loading: true
  });
  this.fetchData(res=>{
    const {dataList} = this.state;
    dataList = [...dataList,...res.results];

    if(dataList.length > 40){
       message.warning('Infinite List loaded all');
      this.setState({
        loadMore:false
      })
    }
    this.setState({
      dataList,
      loading:false
    });
  })

}
render(){
  const {dataList,loadMore,loading} = this.state;

  const showLoadMore = loadMore ?  (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button type="link" size="large" onClick={this.onLoadMore}><SmallDashOutlined style={{fontSize:"2.2rem"}} /></Button>
        </div>
      ) : null;
return  (
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.onLoadMore}
          hasMore={!loading && loadMore}
          useWindow={false}
        >
  
  <List
    itemLayout="horizontal"
    dataSource={dataList}
    header = {"Header"}
    renderItem={this.renderItem}
    loading={loading && loadMore}
    footer = {dataList.length}
  />
  </InfiniteScroll>
  </div>)
}

}