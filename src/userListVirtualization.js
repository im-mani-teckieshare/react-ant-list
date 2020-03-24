import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { List, message, Avatar, Button } from "antd";
import { SmallDashOutlined } from "@ant-design/icons";

import {AutoSizer, List as VList, InfiniteLoader,WindowScroller} from 'react-virtualized/dist/commonjs';

// import { AutoSizer } from "react-virtualized";
// import VList from "react-virtualized/dist/commonjs/List";
// import WindowScroller from "react-virtualized/dist/commonjs/WindowScroller";
// import InfiniteLoader from "react-virtualized/dist/commonjs/InfiniteLoader";
import reqwest from "reqwest";

const fakeDataUrl =
  "https://randomuser.me/api/?results=15&inc=name,gender,email,nat&noinfo";
export default class UserListVirtualization extends React.Component {
  state = {
    dataList: [],
    loading: true,
    loadMore: true,
    listHeight: 300,
    listRowHeight: 60,
    overscanRowCount: 10,
    scrollToIndex: undefined,
    showScrollingPlaceholder: false,
    useDynamicRowHeight: false
  };

  loadedRowsMap = {};

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

  renderItem = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style // Style object to be applied to row (to position it)
  }) => {
    let { dataList } = this.state;
    let item = dataList[index];
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

  isRowLoaded = ({ index }) => !!this.loadedRowsMap[index];

  handleInfiniteOnLoad = ({ startIndex, stopIndex }) => {
    this.setState({
      loading: true
    });
    for (let i = startIndex; i <= stopIndex; i++) {
      // 1 means loading
      this.loadedRowsMap[i] = 1;
    }
    this.onLoadMore();
  };
  onLoadMore = () => {
    this.setState({
      loading: true
    });
    this.fetchData(res => {
      let { dataList } = this.state;
      dataList = [...dataList, ...res.results];

      if (dataList.length > 400) {
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
    const {
      listHeight,
      listRowHeight,
      overscanRowCount,
      scrollToIndex,
      showScrollingPlaceholder,
      useDynamicRowHeight
    } = this.state;

    const vlist = ({
      height,
      // isScrolling,
      // onChildScroll,
      scrollTop,
      onRowsRendered,
      width
    }) => {
      return (
        <VList
        autoSize
          height={500}
          // isScrolling={isScrolling}
          // onScroll={onChildScroll}
          overscanRowCount={2}
          rowCount={dataList.length}
          rowHeight={listRowHeight}
          rowRenderer={this.renderItem}
          onRowsRendered={onRowsRendered}
          width={width}
          // scrollTop={scrollTop}
        />
      );
    };

    const autoSize = ({
      height,
      // isScrolling,
      // onChildScroll,
      scrollTop,
      onRowsRendered
    }) => (
      <AutoSizer disableHeight>
        {({ width }) =>
          vlist({
            height,
            // isScrolling,
            // onChildScroll,
            scrollTop,
            onRowsRendered,
            width
          })
        }
      </AutoSizer>
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

    const infiniteLoader = ({
      height,
      // isScrolling,
      // onChildScroll,
      // scrollTop
    }) => (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.handleInfiniteOnLoad}
        rowCount={dataList.length}
        threshold={5}
      >
        {({ onRowsRendered }) =>
          autoSize({
            height,
            // isScrolling,
            // onChildScroll,
            // scrollTop,
            onRowsRendered
          })
        }
      </InfiniteLoader>
    );

    return (
        <List
          itemLayout="horizontal"
          header={"Header"}
          loading={loading && loadMore}
          footer={dataList.length}
          style={{flex: "1 1 auto" }}
        >
          {/* <WindowScroller style={{ overflow: "auto" }}> */}
            {infiniteLoader(500)}
          {/* </WindowScroller> */}
        </List>
    );
  }
}
