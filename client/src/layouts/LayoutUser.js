import React from "react";
import { Route, Switch } from "react-router-dom";

import { useState } from "react";

import { Layout } from "antd";

import MenuSider from "../components/User/MenuTop/MenuSider";
import MenuTop from "../components/User/MenuTop/MenuTop";
import "./Layout.scss";

import { Button } from "antd";
import {
  PoweroffOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

export default function LayoutUser(props) {
  const { Header, Content, Footer } = Layout;
  const { routes } = props;

  const [menuCollapsed, setMenuCollapsed] = useState(true);

  return (
    <Layout>
      <Header className="layout-user__header" style={{ zIndex: 2 }}>
        <Button type="link" onClick={() => setMenuCollapsed(!menuCollapsed)}>
          {menuCollapsed ? (
            <MenuUnfoldOutlined style={{ fontSize: "25px" }} />
          ) : (
            <MenuFoldOutlined style={{ fontSize: "25px" }} />
          )}
        </Button>

        <MenuTop />
      </Header>

      <Layout className="layout-user">
        <div style={{ position: "fixed", zIndex: 1 }}>
          <MenuSider menuCollapsed={menuCollapsed} />
        </div>
        <Content
          className="layout-user__content"
          style={{ marginLeft: menuCollapsed ? "0px" : "100px", zIndex: 0 }}
        >
          <LoadRoutes routes={routes} />
        </Content>
      </Layout>
    </Layout>
  );
}

function LoadRoutes({ routes }) {
  return (
    <Switch>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.component}
        />
      ))}
    </Switch>
  );
}
