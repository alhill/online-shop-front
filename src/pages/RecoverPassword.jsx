import React, { useState, useEffect } from "react";
import { useAuthentication } from "../context/authentication";
import { useData } from '../context/dataProvider'
import { useHistory } from "react-router-dom";
import { Container, FlexWrapper, FormStyler } from "../components";
import styled from 'styled-components'
import { intersection } from "lodash";
import { Button, Form, Input, message, Modal } from "antd";
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from "firebase/functions";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'
import { estaSeguroDeQue } from "../utils";

const RecoverPassword = () => {
    const history = useHistory();
    const form = Form.useForm()[0]
    const [loading, setLoading] = useState(false)
    const auth = getAuth()
    
    const launchModal = email => {
        Modal.success({
            title: "Revisa tu correo",
            content: `En breves instantes recibirás un correo electrónico en ${email} con un enlace de recuperación de contraseña`,
            onOk: () => history.push("/")
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
                        <Button
                            onClick={() => history.push("/?login")}
                        >Volver</Button>
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
    
    export default RecoverPassword
    