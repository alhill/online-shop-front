import App from "next/app";
import 'antd/dist/reset.css'
import '../style.css'
import { ConfigProvider } from "antd";
import antdThemeOverrides from '../antdThemeOverrides'
import { FirebaseProvider } from "../context/firebase";
import { AuthenticationProvider } from "../context/authentication";
import { AppProvider } from "../context/appContext";

class NogApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <FirebaseProvider>
        <AuthenticationProvider>
          <AppProvider>
            <ConfigProvider theme={antdThemeOverrides}>
                <Component {...pageProps} />
            </ConfigProvider>
          </AppProvider>
        </AuthenticationProvider>
      </FirebaseProvider>
    )
  }
}

export default NogApp
