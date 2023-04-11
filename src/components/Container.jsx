import { UserOutlined } from "@ant-design/icons";
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons/lib/icons";
import { Button, Divider, Form, Input, Modal, message, Dropdown } from "antd";
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { useData } from "../context/dataProvider";
import { useAuthentication } from "../context/authentication";
import { useHistory } from "react-router-dom";
import FlexWrapper from "./FlexWrapper";
import { set } from "lodash";

const Container = ({ children, loading }) => {
  const { loadProducts, cart, cartModal, setCartModal, mutateCart } = useData()
  const { user, doLogin, doLogout } = useAuthentication()
  const history = useHistory()

  const [loginModal, setLoginModal] = useState({ show: false })

  useEffect(() => {
    loadProducts()
    if(window.location.search === "?login" && !user){
      setLoginModal({ show: true })
    }
  }, [])

  const [loginForm] = Form.useForm()

  const handleLogin = async () => {
    const { email, password } = loginForm.getFieldsValue()
    try{
      await doLogin(email, password)
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
          to="/"
        >
          <img 
            // src={process.env.REACT_APP_MAIN_LOGO} 
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
                  label: <Link to="/mi-perfil">Mi perfil</Link>
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
          <ShoppingCartOutlined />
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
            <Button
              type="primary"
              onClick={() => history.push("/nuevo-usuario")}
            >Crear cuenta</Button>
            <Button
              type="primary"
              onClick={() => history.push("/recuperar-contrasena")}
            >Recuperar contraseña</Button>
        </FlexWrapper>
      </Modal>

      <Modal
        open={cartModal}
        onCancel={() => setCartModal(false)}
        footer={null}
      >
        <h3 style={{ marginTop: "1em", fontWeight: "bold" }}>Tu cesta</h3>
        {(cart?.items || []).length === 0 && <p>Tu cesta está vacía</p>}
        {(cart?.items || []).map(it => {
          return <CartRow>
            <p><strong>{it.qty}x</strong> - {it.name}:</p>
            <p><strong>{it.qty * it.price}€</strong></p>
            <div style={{
              display: "flex",
              flexDirection: "column"
            }}>
              <Button
                size="small"
                icon={<PlusOutlined style={{ color: "#666", fontSize: 12 }} />}
                onClick={() => mutateCart(it.slug, 1)}
                />
              <Button 
                size="small" 
                icon={<MinusOutlined style={{ color: "#666", fontSize: 12 }} />} 
                onClick={() => mutateCart(it.slug, -1)}
              />
            </div>
          </CartRow>
        })}
        <Divider />
        <h2>TOTAL: {cart.total}€</h2>
        <FlexWrapper>
          <Button onClick={() => setCartModal(false)}>Continuar comprando</Button>
          <Link to="/finalizar-compra">
            <Button
              type="primary"
              disabled={(cart?.items || []).length === 0}
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

const CartRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
  & p{
    margin: 0;
  }
`

export default Container
