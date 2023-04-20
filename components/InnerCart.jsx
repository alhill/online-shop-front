import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { useAppContext } from "../context/appContext"
import { Button, Divider, Form, Input } from 'antd'
import styled from 'styled-components'
import { useAuthentication } from '../context/authentication'
import { useEffect } from 'react'

const InnerCart = ({ showAddress, form, handleSubmit }) => {

    const { cart, mutateCart } = useAppContext()
    const { user } = useAuthentication()
    const addressForm = form || Form.useForm()[0]

    useEffect(() => {
        if(user){
            addressForm.setFieldsValue({
                email: user?.email || "",
                name: user?.name || "",
                surname: user?.surname || "",
                address: user?.address || "",
                postalCode: user?.postalCode || "",
                town: user?.town || ""
            })
        }
    }, [user])

    return (
        <>
            {(cart?.items || []).length === 0 && <p>Tu cesta está vacía</p>}
            {(cart?.items || []).map(it => {
                return (
                    <CartRow key={"cartItem-" + it.id}>
                        <p style={{ flex: 1 }}><strong>{it.qty}x</strong> - {it.name}:</p>
                        <>
                            <p><strong>{it.qty * it.price}€</strong></p>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                marginLeft: "1em"
                            }}>
                                <Button
                                    size="small"
                                    icon={<PlusOutlined style={{ color: "#666", fontSize: 12 }} />}
                                    onClick={() => mutateCart(it.slug || it.id, 1)}
                                    />
                                <Button 
                                    size="small" 
                                    icon={<MinusOutlined style={{ color: "#666", fontSize: 12 }} />} 
                                    onClick={() => mutateCart(it.slug || it.id, -1)}
                                />
                            </div>
                        </>
                    </CartRow>
                )
            })}
            { showAddress && (
                <>
                    <Divider />
                    <AddressWrapper>
                        <h3>Dirección de envío</h3>
                        <Form
                            name="addressForm"
                            form={addressForm}
                            layout="vertical"
                            onFinish={() => handleSubmit()}
                        >
                            <Form.Item 
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: "Campo requerido" }]}
                            >
                                <Input 
                                    disabled={user} 
                                    value={addressForm.getFieldValue("email")}
                                    onChange={evt => addressForm.setFieldValue("email", evt.target.value)}
                                    placeholder='Email'
                                />
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

                    </AddressWrapper>
                </>
            )}
            <Divider />
            <h2 style={{ textAlign: "center" }}>TOTAL: {cart.total}€</h2>
        </>
    )
}

const CartRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
  & p{
    margin: 0;
  }
`

const AddressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5em;
  width: 100%;
  p {
    margin-bottom: 0.5em;
  }
  h3{
    font-weight: normal;
    font-size: 1.5em;
  }
`

export default InnerCart