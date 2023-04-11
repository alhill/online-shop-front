import React, { useState, useEffect } from "react";
import { useData } from '../context/dataProvider'
import { useHistory } from "react-router-dom";
import { Container, FormStyler } from "../components";
import { Button, Form, Input, message, Modal } from "antd";
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from "firebase/functions";
import styled from 'styled-components'

const VerifyUser = () => {
  const history = useHistory();
  const form = Form.useForm()[0]
  const { allProducts, tags, productsPerTag, featured, frontpageProducts } = useData()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const [email, code] = (window.location.search || "").replace("?email=", "").replace("&code=", "#").split("#")
    if(email){ form.setFieldValue("email", email) }
    if(code){ form.setFieldValue("code", code)}
  }, [])

  const functions = getFunctions(getApp(), "europe-west1");
  connectFunctionsEmulator(functions, "localhost", 5001);
  const sendVerificationEmail = httpsCallable(functions, 'sendVerificationEmail')

  const resendCode = async () => {
    const email = form.getFieldValue("email")
    if(!email){ await form.validateFields(["email"]) }
    setLoading(true)
    try{
        const res = await sendVerificationEmail({ email })
        console.log(res)
    } catch(err){

    }
    setLoading(false)
  }

  const handleSubmit = async values => {
    setLoading(true)
    try{

    } catch(err) {
      message.error("Se ha producido un error durante el proceso de registro")
    }
    setLoading(false)
  }

  return (
    <Container>
      <FormStyler>
        <h2>Verificar usuario</h2>
        <Form
          form={form}
          layout="vertical"
          name="verifyUser"
          onFinish={handleSubmit}
        >
          <Form.Item name="email" label="Correo electrónico" rules={[{ required: true, message: "Campo requerido" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Código de verificación" rules={[
            { required: true, message: "Campo requerido" }
          ]}>
            <Input />
          </Form.Item>
          <BtnWrapper>
            <Button
                onClick={() => resendCode()}
                loading={loading}
            >Reenviar código</Button>
            <Button
                type="primary"
                loading={loading}
            >Verificar usuario</Button>
          </BtnWrapper>
        </Form>
      </FormStyler>
    </Container>
  );
};

const BtnWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    margin-top: 2em;
    flex-wrap: wrap;
    & .ant-btn{
        margin-bottom: 0.5em;
    }
`

export default VerifyUser
