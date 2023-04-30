import { UserOutlined } from "@ant-design/icons";
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons/lib/icons";
import { Button, Divider, Form, Input, Modal, message, Dropdown } from "antd";
import Link from 'next/link'
import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { useAppContext } from "../context/appContext";
import { useAuthentication } from "../context/authentication";
import FlexWrapper from "./FlexWrapper";
import { InnerCart } from '.'
import { useRouter } from 'next/router'
import { t } from '../utils'

const Container = ({ children, loading, l }) => {
  const { loadProducts, cart, cartModal, setCartModal, forceSetCart } = useAppContext()
  const { user, doLogin, doLogout } = useAuthentication()
  const router = useRouter()

  const [loginModal, setLoginModal] = useState({ show: false })

  useEffect(() => {
    loadProducts()

    if(router.asPath.includes("/es/") || router.asPath === "/es"){ localStorage.setItem("lastLocale", "es") }
    else if(router.asPath.includes("/en/") || router.asPath === "/en"){ localStorage.setItem("lastLocale", "en") }

    if(window.location.search === "?login" && !user){
      setLoginModal({ show: true })
    }
  }, [])

  useEffect(() => {
    if(user?.lastCart){
      forceSetCart(user.lastCart)
    }
  }, [user])

  const [loginForm] = Form.useForm()

  const handleLogin = async () => {
    const { email, password } = loginForm.getFieldsValue()
    try{
      await doLogin(email, password)
      setLoginModal({ show: false })
    } catch(err) {
      if(err.code === "auth/invalid-email" || err.code === "auth/wrong-password"){
        message.error("El usuario o la contraseña son incorrectos")
      }
    }
  }

  const changeLng = locale => {
    const newRoute = `/${locale}${router.asPath.slice(3)}`
    localStorage.setItem("lastLocale", locale)
    router.push(newRoute)
  }

  return (
    <Wrapper>
      <Header>
        <Link
          href={`/${l}`}
        >
          <img 
            // src={process.env.NEXT_PUBLIC_MAIN_LOGO} 
            src="http://localhost:3000/logo.png"
            alt="Srta.Nognog Shop"
            className="logo"
          />
        </Link>
        <Buttons>
          <Dropdown
            menu={{
              items: [
                {
                  key: "es",
                  label: (
                    <FlagWrapper onClick={() => changeLng("es")}>
                      <Flag src={`http://localhost:3000/es.png`} size="1em" />
                      <p>Castellano</p>
                    </FlagWrapper>
                  )
                },
                {
                  key: "en",
                  label: (
                    <FlagWrapper onClick={() => changeLng("en")}>
                      <Flag src={`http://localhost:3000/en.png`} size="1em" />
                      <p>English</p>
                    </FlagWrapper>
                  )
                }
              ]
            }}
          >
            <Flag src={`http://localhost:3000/${l}.png`} />
          </Dropdown>
          <Dropdown
            disabled={!user}
            menu={{
              items: [
                {
                  key: "profile",
                  label: <Link href={`/${l}/mi-perfil`}>Mi perfil</Link>
                },
                {
                  key: "logout",
                  label: <div onClick={async () => {
                    try{
                      await doLogout()
                      router.push(`/${l}`)
                      message.info("Has cerrado sesión correctamente, vuelve pronto!")
                    } catch(err) {
                      console.log(err)
                    }
                  }}>Cerrar sesión</div>
                }
              ]
            }}
          >
            <div>
              { user?.email && window.screen.width > 600 && <span style={{ marginRight: "0.5em" }}>{ user.email }</span> }
              <UserOutlined 
                onClick={() => {
                  if(!user){
                    setLoginModal({ show: true })
                  }
                }}
              />
            </div>
          </Dropdown>
          <ShoppingCartOutlined 
            onClick={() => setCartModal(true)}
          />
        </Buttons>
      </Header>
      <Body>
        { children }
      </Body>
      <Footer>
        &reg; {new Date().getFullYear()} Srta. Nognog
      </Footer>

      <Modal
        open={loginModal.show}
        onCancel={() => setLoginModal({ show: false })}
        footer={null}
      >
        <h3>{t(l, "logToYourAccount")}</h3>
        <Form
          name="loginForm"
          form={loginForm}
          layout="vertical"
          onFinish={() => handleLogin()}
          initialValues={{
            email: "",
            password: ""
          }}
        >
          <Form.Item
            label={t(l, "email")}
            placeholder={t(l, "email")}
            name="email"
            rules={[{ required: true, message: t(l, "requiredField") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t(l, "password")}
            placeholder={t(l, "password")}
            name="password"
            rules={[{ required: true, message: t(l, "requiredField") }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
        <FlexWrapper>
          <Button onClick={() => setLoginModal({ show: false })}>{t(l, "cancel")}</Button>
          <Button 
            type="primary"
            onClick={() => loginForm.submit()}
          >{t(l, "logIn")}</Button>
        </FlexWrapper>
        <Divider />
        <FlexWrapper>
            <Link href={`/${l}/nuevo-usuario`}><Button type="primary">{t(l, "createAccount")}</Button></Link>
            <Link href={`/${l}/recuperar-contrasena`}><Button type="primary">{t(l, "recoverPassword")}</Button></Link>
        </FlexWrapper>
      </Modal>

      <Modal
        open={cartModal}
        onCancel={() => setCartModal(false)}
        footer={null}
      >
        <h3 style={{ marginTop: "1em", fontWeight: "bold" }}>{t(l, "myCart")}</h3>
        <InnerCart l={l} />
        <FlexWrapper>
          <Button onClick={() => setCartModal(false)}>{t(l, "continueShopping")}</Button>
          <Link href={`/${l}/finalizar-compra`}>
            <Button
              type="primary"
              disabled={(cart?.items || []).length === 0}
              onClick={() => setCartModal(false)}
            >{t(l, "checkout")}</Button>
          </Link>
        </FlexWrapper>
      </Modal>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  width: calc(100vw - 4em);
  max-width: 1200px;
  flex: 1;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1em;
  width: 100%;
  .logo{
    width: 10em;
    maxWidth: 35vw;
    object-fit: contain;
  }
`

const Buttons = styled.div`
  display: flex;
  align-items: center;
  .anticon{
    font-size: 1.5em;
  }
  & > * {
    display: flex;
    align-items: center;
    color: #aaa;
    padding: 0.3em;
    transition: all 300ms;
    border-radius: 2px;
    &:hover{
      background-color: #f3f3f3;
    }
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100px;
  padding: 1em;
`

const Flag = styled.img`
  width: ${({ size }) => size ? size : "2em"};
  height: ${({ size }) => size ? size : "2em"};
  opacity: 0.8;
  margin-right: 0.3em;
`

const FlagWrapper = styled.div`
  display: flex;
  align-items: center;
  p {
    margin: 0 0 0 5px;
  }
`

export default Container
