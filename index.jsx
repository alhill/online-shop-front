import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import { RootProvider } from "./rootProviders";
import 'antd/dist/reset.css'
import './style.css'
import { ConfigProvider } from "antd";
import antdThemeOverrides from './antdThemeOverrides'

ReactDOM.render(
  <React.StrictMode>
    <RootProvider>
      <ConfigProvider
        theme={antdThemeOverrides}
      >
        <App />
      </ConfigProvider>
    </RootProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
