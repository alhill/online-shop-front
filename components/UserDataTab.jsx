import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Form, Input, Button, message } from 'antd'  
import { useAuthentication } from '../context/authentication'
import { FormStyler } from '.' 
import Link from 'next/link'
import { firestore } from '../utils'
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore'

const UserDataTab = () => {
    const [userForm] = Form.useForm()
    const [userExists, setUserExists] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async values => {
        setLoading(true)
        const mutateDoc = userExists ? updateDoc : setDoc
        try{
            console.log(values)
            const newUser = await mutateDoc(doc(firestore, "users", user.uid), values)
            message.success("Tus datos se han guardado correctamente")
            console.log({ newUser })
        } catch(err) {
            console.log(err)
            message.error("Se ha producido un error al guardar tus datos de usuario")
        }
        setLoading(false)
    }
    
    const { user } = useAuthentication()

    useEffect(() => {
        if(user?.uid){
            (async () => {
                const ref = doc(firestore, "users", user.uid)
                const snapshot = await getDoc(ref)
                const exists = snapshot.exists()
                if(exists){
                    setUserExists(exists)
                    const { name, surname, address, postalCode, town } = snapshot.data()
                    userForm.setFieldsValue({ name, surname, address, postalCode, town })
                }
            })()
        }
    }, [user])
    
    return (
        <Wrapper>
            <h3>Datos de usuario</h3>
            <FormStyler>
                <Form
                    form={userForm}
                    name="userForm"
                    onFinish={handleSubmit}
                    layout="vertical"
                >
                    <Form.Item label="Email"><Input disabled value={user?.email} /></Form.Item>
                    <Form.Item label="Contraseña">
                        <Link href="/cambiar-contrasena">
                            <Button type="primary">Cambiar contraseña</Button>
                        </Link>
                    </Form.Item>
                    <Form.Item
                        label="Nombre"
                        name="name"
                        rules={[{ required: true, message: "Campo requerido" }]}
                    >
                        <Input placeholder="Nombre" />
                    </Form.Item>
                    <Form.Item
                        label="Apellidos"
                        name="surname"
                        rules={[{ required: true, message: "Campo requerido" }]}
                    >
                        <Input placeholder="Apellidos" />
                    </Form.Item>
                    <Form.Item
                        label="Dirección"
                        name="address"
                        rules={[{ required: true, message: "Campo requerido" }]}
                    >
                        <Input.TextArea 
                            placeholder="Dirección" 
                            autoSize
                        />
                    </Form.Item>
                    <Form.Item
                        label="Código postal"
                        name="postalCode"
                        rules={[{ required: true, message: "Campo requerido" }]}
                    >
                        <Input placeholder="Código postal" />
                    </Form.Item>
                    <Form.Item
                        label="Localidad"
                        name="town"
                        rules={[{ required: true, message: "Campo requerido" }]}
                    >
                        <Input placeholder="Localidad" />
                    </Form.Item>
                </Form>
                <Button
                    type="primary"
                    onClick={() => userForm.submit()}
                    loading={loading}
                >Guardar datos</Button>
            </FormStyler>
        </Wrapper>
        )
    }
    
    const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    `
    
    export default UserDataTab
    