import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { List, message, Avatar, Spin, Button, Icon, message } from "antd";
import { SmallDashOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroller";
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import reqwest from "reqwest";

const fakeDataUrl =
  "https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo";
export default class UserListVirtualization extends React.Component {
  state = {
    dataList: [],
    loading: true,
    loadMore: true,
    listHeight: 300,
    listRowHeight: 50,
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

  renderItem = (key, // Unique key within array of rows
  index, // Index of row within collection
  isScrolling, // The List is currently being scrolled
  isVisible, // This row is visible within the List (eg it is not an overscanned row)
  style, // Style object to be applied to row (to position it)
  ) => {
    console.log('comes')
    let {dataList} = this.state;
    let item = dataList[index];
    console.log(index);
    return (
      <List.Item key={key}>
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
    message.warning("Infinite List loaded all");
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

const vList = () => (
      <VList
        autoHeight
        height={listHeight}
        overscanRowCount={overscanRowCount}
        rowCount={5}
        rowHeight={listRowHeight}
        rowRenderer={this.renderItem}
        scrollTop={0}
      />
    );

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

    console.log(dataList)
    return (
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
            // dataSource={dataList}
            header={"Header"}
            // renderItem={this.renderItem}
            loading={loading && loadMore}
            footer={dataList.length}
          >
          {vList()}
          </List>
        </InfiniteScroll>
      </div>
    );
  }
}
