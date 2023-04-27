import { useState } from "react";
import { Container, FlexWrapper, FormStyler } from "../../components";
import { Button, Form, Input, message, Modal } from "antd";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'

const RecoverPassword = () => {
    const form = Form.useForm()[0]
    const [loading, setLoading] = useState(false)
    const auth = getAuth()
    const router = useRouter()
    
    const launchModal = email => {
        Modal.success({
            title: "Revisa tu correo",
            content: `En breves instantes recibirás un correo electrónico en ${email} con un enlace de recuperación de contraseña`,
            onOk: () => router.push("/")
        })
    }

    const handleSubmit = async values => {
        setLoading(true)
        try{
            await sendPasswordResetEmail(auth, values?.email)
        } catch(err) {
            if(err.code === "auth/invalid-email"){
                message.error("El correo no es válido")
            } else if(err.code === "auth/user-not-found"){
                launchModal(values?.email)
            }
        }
        setLoading(false)
    }
    
    return (
        <Container>
            <FormStyler>
                <Form
                    form={form}
                    layout="vertical"
                    name="register"
                    onFinish={handleSubmit}
                >
                    <h2>Recuperación de contraseña</h2>
                    <Form.Item name="email" label="Correo electrónico" rules={[{ required: true, message: "Campo requerido" }]}>
                        <Input />
                    </Form.Item>
                    <FlexWrapper>
                        <Link href="/?login">
                            <Button>Volver</Button>
                        </Link>
                        <Button
                            type="primary"
                            onClick={() => form.submit()}
                            loading={loading}
                        >Recuperar contraseña</Button>
                    </FlexWrapper>
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

export default RecoverPassword
    