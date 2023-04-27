import { useState } from "react";
import { useRouter } from "next/router"
import { Container, FormStyler } from "../../components";
import { intersection } from "lodash";
import { Button, Form, Input, message, Modal } from "antd";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth'
import { estaSeguroDeQue, t } from "../../utils";

const Register = ({ l }) => {

  const form = Form.useForm()[0]
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const auth = getAuth()

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
          onOk: () => router.push("/")
        })
      }
    } catch(err) {
      if(err?.code === "auth/email-already-in-use"){
        estaSeguroDeQue({
          title: "Usuario registrado",
          text: "El correo electrónico ya está registrado. ¿Deseas recuperar la contraseña?",
          desea: "Recuperar contraseña",
          fn: () => router.push("/recuperar-contrasena")
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
    <Container l={l}>
      <FormStyler>
        <Form
          form={form}
          layout="vertical"
          name="register"
          onFinish={handleSubmit}
          onFinishFailed={handleFailedSubmit}
        >
          <Form.Item 
            name="email" 
            label={t(l, "email")} 
            placeholder={t(l, "email")} 
            rules={[{ required: true, message: t(l, "requiredField") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="password" 
            label={t(l, "password")}
            placeholder={t(l, "password")}
            rules={[
              { required: true, message: t(l, "requiredField") },
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
            ]
          }>
            <Input.Password />
          </Form.Item>
          <Form.Item 
            name="password2" 
            label={t(l, "password2")}
            placeholder={t(l, "password2")}
            rules={[
              { required: true, message: t(l, "requiredField") },
              { 
                validator: async (item, password2) => {
                  const password = form.getFieldValue("password")
                  if((password !== password2) && password2){
                    throw new Error("Las contraseñas no coinciden")
                  }
                },
                validateTrigger: "onSubmit"
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button
            type="primary"
            onClick={() => form.submit()}
            style={{ marginTop: "1em" }}
            loading={loading}
          >{t(l, "endRegister")}</Button>
        </Form>
      </FormStyler>
    </Container>
  );
};

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


export default Register
