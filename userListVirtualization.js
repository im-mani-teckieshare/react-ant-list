import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { List, message, Avatar, Spin, Button, Icon, message } from "antd";
import { SmallDashOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroller";
import {AutoSizer} from 'react-virtualized'; 
import VList from 'react-virtualized/dist/commonjs/List';
import reqwest from "reqwest";

import 'react-virtualized/styles.css'; // only needs to be imported once

const fakeDataUrl =
  "https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo";
export default class UserListVirtualization extends React.Component {
  state = {
    dataList: [],
    loading: true,
    loadMore: true,
    listHeight: 300,
    listRowHeight: 100,
    overscanRowCount: 10,
    scrollToIndex: undefined,
    showScrollingPlaceholder: false,
    useDynamicRowHeight: false
  };

  componentDidMount() {
    this.fetchData(res => {
      this.setState({
        dataList: res.results,
        loading: false
      });
    });
  }

  fetchData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: "json",
      method: "get",
      contentType: "application/json",
      success: res => {
        callback(res);
      }
    });
  };

  renderItem = ({key, // Unique key within array of rows
  index, // Index of row within collection
  isScrolling, // The List is currently being scrolled
  isVisible, // This row is visible within the List (eg it is not an overscanned row)
  style, // Style object to be applied to row (to position it)
  }) => {
    let {dataList} = this.state;
    let item = dataList[index];
  console.log('comes render')
    return (
      <List.Item key={key} style={style}>
        <List.Item.Meta
          avatar={
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          }
          title={item.name.last}
          description={item.email}
        />
      </List.Item>
    );
  };

  onLoadMore = () => {
    console.log("comes scroll");
    this.setState({
      loading: true
    });
    this.fetchData(res => {
      const { dataList } = this.state;
      dataList = [...dataList, ...res.results];

      if (dataList.length > 40) {
        message.warning("Infinite List loaded all");
        this.setState({
          loadMore: false
        });
      }
      this.setState({
        dataList,
        loading: false
      });
    });
  };
  render() {
    const { dataList, loadMore, loading } = this.state;
    const {listHeight,listRowHeight,
    overscanRowCount,scrollToIndex,
    showScrollingPlaceholder,
    useDynamicRowHeight} = this.state;

const vList = (height,width) =>{
   return(
      <VList
        autoHeight
        height={height}
        overscanRowCount={overscanRowCount}
        rowCount={dataList.length}
        rowHeight={listRowHeight}
        rowRenderer={this.renderItem}
        scrollTop={0}
         width={300}
      />
    )
    
};

    const autoSizer = (height,width)=>(
      <AutoSizer
    >
    {({height, width}) => {
      vList(height,width)
      
      }
    }
    </AutoSizer>
    )

    const showLoadMore = loadMore ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px"
        }}
      >
        <Button type="link" size="large" onClick={this.onLoadMore}>
          <SmallDashOutlined style={{ fontSize: "2.2rem" }} />
        </Button>
      </div>
    ) : null;

    return (
          <List
            itemLayout="horizontal"
            header={"Header"}
            loading={loading && loadMore}
            footer={dataList.length}
            style = {{height:"100%",flex: "1 1 auto"}}
          >
          {autoSizer()}
          </List>
    );
  }
}
