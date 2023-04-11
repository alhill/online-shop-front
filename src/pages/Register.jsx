import React, { useState, useEffect } from "react";
import { useAuthentication } from "../context/authentication";
import { useData } from '../context/dataProvider'
import { useHistory } from "react-router-dom";
import { Container, FormStyler } from "../components";
import styled from 'styled-components'
import { intersection } from "lodash";
import { Button, Form, Input, message, Modal } from "antd";
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from "firebase/functions";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth'
import { estaSeguroDeQue } from "../utils";

const Register = () => {
  const history = useHistory();
  const form = Form.useForm()[0]
  const { allProducts, tags, productsPerTag, featured, frontpageProducts } = useData()

  const [loading, setLoading] = useState(false)

  const auth = getAuth()
  const functions = getFunctions(getApp(), "europe-west1");
  connectFunctionsEmulator(functions, "localhost", 5001);
  const registerUser = httpsCallable(functions, 'registerUser');

  useEffect(() => {
    console.log({ allProducts, tags, productsPerTag, featured, frontpageProducts })
  }, [allProducts, tags, productsPerTag, featured, frontpageProducts])

  const handleSubmit = async values => {
    setLoading(true)
    try{
      const resp = await createUserWithEmailAndPassword(auth, values?.email, values?.password)
      console.log({ resp })
      if(!resp?.user?.emailVerified){
        await sendEmailVerification(resp?.user)
        Modal.success({
          title: "Revisa tu correo",
          content: `En breves instantes recibirás un correo electrónico en ${values?.email} con un enlace de verificación de registro`,
          onOk: () => history.push("/")
        })
      }
    } catch(err) {
      if(err?.code === "auth/email-already-in-use"){
        estaSeguroDeQue({
          title: "Usuario registrado",
          text: "El correo electrónico ya está registrado. ¿Deseas recuperar la contraseña?",
          desea: "Recuperar contraseña",
          fn: () => history.push("/recuperar-contrasena")
        })
      } else if(err?.code === "auth/invalid-email"){
        message.error("El correo electrónico introducido no es válido")
      } else {
        console.log(err)
        message.error("Se ha producido un error durante el proceso de registro")
      }
    }
    setLoading(false)
  }

  const handleFailedSubmit = () => {
    message.warning("Algunos campos contienen errores")
  }

  return (
    <Container>
      <FormStyler>
        <Form
          form={form}
          layout="vertical"
          name="register"
          onFinish={handleSubmit}
          onFinishFailed={handleFailedSubmit}
        >
          <Form.Item name="email" label="Correo electrónico" rules={[{ required: true, message: "Campo requerido" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Contraseña" rules={[
            { required: true, message: "Campo requerido" },
            { 
              validator: async (item, password) => {
                if(password){
                  let err = []
                  if(password.length < 6){ err.push("La contraseña ha de tener al menos 6 caracteres") }
                  if(intersection(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], password.split("")).length === 0){ err.push("La contraseña ha de contener al menos un número")}
                  if(password === password.toLocaleLowerCase()){ err.push("La contraseña ha de contener mayúsculas y minúsculas") }
                  
                  if(err.length > 0){ throw err.map(e => new Error(e)) }
                }
              },
              validateTrigger: "onSubmit"
            }
          ]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="password2" label="Confirmar contraseña" rules={[
            { required: true, message: "Campo requerido" },
            { 
              validator: async (item, password2) => {
                const password = form.getFieldValue("password")
                if((password !== password2) && password2){
                  throw new Error("Las contraseñas no coinciden")
                }
              },
              validateTrigger: "onSubmit"
            }
          ]}>
            <Input.Password />
          </Form.Item>
          <Button
            type="primary"
            onClick={() => form.submit()}
            style={{ marginTop: "1em" }}
            loading={loading}
          >Finalizar registro</Button>
        </Form>
      </FormStyler>
    </Container>
  );
};

export default Register
