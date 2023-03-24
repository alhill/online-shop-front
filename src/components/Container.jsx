import { UserOutlined } from "@ant-design/icons";
import { ShoppingCartOutlined } from "@ant-design/icons/lib/icons";
import { Button, Divider, Form, Input, Modal, message, Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { useData } from "../context/dataProvider";
import { useAuthentication } from "../context/authentication";
import { useHistory } from "react-router-dom";

const Container = ({ children }) => {
  const { loadProducts } = useData()
  const { user, doLogin, doLogout } = useAuthentication()
  const history = useHistory()

  const [loginModal, setLoginModal] = useState({ show: false })

  useEffect(() => {
    loadProducts()
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

  useEffect(() => {
    console.log(user)
  }, [user])

  return (
    <Wrapper>
      <Header>
        <img 
          src={process.env.REACT_APP_MAIN_LOGO} 
          alt="Srta.Nognog Shop"
          className="logo"
        />
        <Buttons>
          <Dropdown
            disabled={!user}
            menu={{
              items: [
                {
                  key: "logout",
                  label: <div onClick={async () => {
                    try{
                      console.log("holi!!")
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
              { user?.email && <span style={{ marginRight: "0.5em" }}>{ user.email }</span> }
              <UserOutlined 
                onClick={() => {
                  if(!user){
                    setLoginModal({ show: true })
                  } else {
                    history.push("/mi-perfil")
                  }
                }}
              />
            </div>
          </Dropdown>
          <ShoppingCartOutlined />
        </Buttons>
      </Header>
      <Body>
        { children }}
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
        <ButtonWrapper>
          <Button onClick={() => setLoginModal({ show: false })}>Cancelar</Button>
          <Button 
            type="primary"
            onClick={() => loginForm.submit()}
          >Acceder</Button>
        </ButtonWrapper>
        <Divider />
        <p style={{ textAlign: "center", fontWeight: "bold" }}>¿Nuevo cliente?</p>
        <ButtonWrapper>
          <Button type="primary">Crear cuenta</Button>
        </ButtonWrapper>
      </Modal>

    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1em;
  width: 100%;
  .logo{
    width: 250px;
    maxWidth: 35vw;
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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`

const Body = styled.div`
  width: 100%;
  flex: 1;
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
