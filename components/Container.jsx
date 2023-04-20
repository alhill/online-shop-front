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

const Container = ({ children, loading }) => {
  const { loadProducts, cart, cartModal, setCartModal, forceSetCart } = useAppContext()
  const { user, doLogin, doLogout } = useAuthentication()

  const [loginModal, setLoginModal] = useState({ show: false })

  useEffect(() => {
    loadProducts()
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

  return (
    <Wrapper>
      <Header>
        <Link
          href="/"
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
            disabled={!user}
            menu={{
              items: [
                {
                  key: "profile",
                  label: <Link href="/mi-perfil">Mi perfil</Link>
                },
                {
                  key: "logout",
                  label: <div onClick={async () => {
                    try{
                      await doLogout()
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
        <h3>Acceder a tu cuenta</h3>
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
            label="Email"
            name="email"
            rules={[{ required: true, message: "Tienes que introducir tu correo electrónico" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "Tienes que introducir tu contraseña" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
        <FlexWrapper>
          <Button onClick={() => setLoginModal({ show: false })}>Cancelar</Button>
          <Button 
            type="primary"
            onClick={() => loginForm.submit()}
          >Acceder</Button>
        </FlexWrapper>
        <Divider />
        <FlexWrapper>
            <Link href="/nuevo-usuario"><Button type="primary">Crear cuenta</Button></Link>
            <Link href="/recuperar-contrasena"><Button type="primary">Recuperar contraseña</Button></Link>
        </FlexWrapper>
      </Modal>

      <Modal
        open={cartModal}
        onCancel={() => setCartModal(false)}
        footer={null}
      >
        <h3 style={{ marginTop: "1em", fontWeight: "bold" }}>Tu cesta</h3>
        <InnerCart />
        <FlexWrapper>
          <Button onClick={() => setCartModal(false)}>Continuar comprando</Button>
          <Link href="/finalizar-compra">
            <Button
              type="primary"
              disabled={(cart?.items || []).length === 0}
              onClick={() => setCartModal(false)}
            >Finalizar compra</Button>
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
    font-size: 2em;
  }
  & > * {
    display: flex;
    align-items: center;
    color: #aaa;
    padding: 0.5em;
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

export default Container
