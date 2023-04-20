import styled from 'styled-components'
import { Form, Input, DatePicker } from 'antd'  
import { FormStyler } from '.' 
import { validateCreditCardNumber } from "../utils"

const CreditCardForm = ({ checkout, form, handlePayment }) => {
    return (
        <Wrapper>
            <h4>TOTAL: {checkout?.amount}€</h4>
            <br />
            <FormStyler>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handlePayment}
                >
                    <Form.Item
                        name="name"
                        label="Nombre"
                        rules={[{ required: true, message: "Campo requerido" }]}
                    >
                        {/* <Input placeholder="Nombre" autoComplete='cc-name'/> */}
                        <Input placeholder="Nombre" />
                    </Form.Item>
                    <div>
                        <Form.Item
                            name="number"
                            label="Número de la tarjeta"
                            rules={[
                                { required: true, message: "Campo requerido" },
                                {
                                    validator: async (item, n) => {
                                        const cardType = validateCreditCardNumber(n)
                                        if(!cardType && n){ 
                                            throw new Error("La tarjeta introducida no es válida") 
                                        }
                                    },
                                    validateTrigger: "onSubmit"
                                }
                            ]}
                        >
                            {/* <Input placeholder="Número de la tarjeta" autoComplete='cc-number'/> */}
                            <Input placeholder="Número de la tarjeta" />
                        </Form.Item>
                    </div>
                    <Form.Item
                        name="expirationDate"
                        label="Fecha de caducidad"
                        rules={[{ required: true, message: "Campo requerido" }]}
                    >
                        {/* <DatePicker.MonthPicker placeholder='Seleccionar fecha' autoComplete='cc-exp'/> */}
                        <DatePicker.MonthPicker placeholder='Seleccionar fecha' />
                    </Form.Item>
                    <Form.Item
                        name="cvv"
                        label="Código de seguridad"
                        rules={[{ required: true, message: "Campo requerido" }]}
                    >
                        {/* <Input.Password placeholder="Código de seguridad" autoComplete='cc-csc'/> */}
                        <Input.Password placeholder="Código de seguridad" />
                    </Form.Item>
                </Form>
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
    
export default CreditCardForm
    