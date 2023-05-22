import App from "next/app";
import 'antd/dist/reset.css'
import '../style.css'
import { ConfigProvider } from "antd";
import esES from 'antd/locale/es_ES'
import enUS from 'antd/locale/en_US'
import antdThemeOverrides from '../antdThemeOverrides'
import { FirebaseProvider } from "../context/firebase";
import { AuthenticationProvider } from "../context/authentication";
import { AppProvider } from "../context/appContext";
import dayjs from "dayjs";

class NogApp extends App {
  state = {
    locale: esES
  }

  componentDidMount() {
    const isEN = (window?.location?.href || "").split(/\/|\?/gm).find(str => str === "en")
    if(isEN){
      this.setState({ locale: enUS })
      dayjs.locale('en')
    } else {
      dayjs.locale('es')
    }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <FirebaseProvider>
        <AuthenticationProvider>
          <AppProvider>
            <ConfigProvider theme={antdThemeOverrides} locale={this.state.locale}>
                <Component {...pageProps} />
            </ConfigProvider>
          </AppProvider>
        </AuthenticationProvider>
      </FirebaseProvider>
    )
  }
}

export default NogApp
