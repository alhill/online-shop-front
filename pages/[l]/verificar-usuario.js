import { useState, useEffect } from "react";
import { Container, FormStyler } from "../../components";
import { Button, Form, Input, message } from "antd";
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from "firebase/functions";
import styled from 'styled-components'

const VerifyUser = ({ l }) => {
  const form = Form.useForm()[0]

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
        message.success("Se ha enviado a tu correo electrónico un enlace de verificación. Pincha en él para verificar tu registro")
        console.log(res)
    } catch(err){}
    setLoading(false)
  }

  return (
    <Container l={l}>
      <FormStyler>
        <h2>Verificar usuario</h2>
        <Form
          form={form}
          layout="vertical"
          name="verifyUser"
        >
          <Form.Item name="email" label="Correo electrónico" rules={[{ required: true, message: "Campo requerido" }]}>
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

export async function getStaticProps(props) {
  const l = props?.params?.l || "es"
  return {
    props: { l }
  }
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { l: "es" }},
      { params: { l: "en" }}
    ],
    fallback: false
  }
}

export default VerifyUser
