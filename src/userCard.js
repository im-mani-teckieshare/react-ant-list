import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Card,Button } from 'antd';
import { EditOutlined,ShoppingCartOutlined,PlusOutlined, EllipsisOutlined, SettingOutlined,MinusOutlined } from '@ant-design/icons';
const ButtonGroup = Button.Group;

const { Meta } = Card;

 function UserCard(){
  return <Card
    hoverable
    style={{ width: 240 }}
    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
     actions={[
         <Action count="1" />
          ]}
  >
    <Meta title="Europe Street beat" description="www.instagram.com" />
  </Card>
}

function Action(prop){
  console.log(prop)
  const {count} = prop;
  return <div>{template(count)}</div>
}

function template(count){
  if(count == 0){
    return (<Button icon={<ShoppingCartOutlined />}>Add To Cart</Button>)
  }
  return (<Button icon={<ShoppingCartOutlined />}>Go To Cart</Button>);
}

export default UserCard;