import { useState, useEffect } from 'react'
import { Container, InnerCart, CreditCardForm, FlexWrapper } from '../../components'
import { Button, Form, message } from 'antd'
import styled from 'styled-components'
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions'
import { useFirebase } from '../../context/firebase'
import { useAuthentication } from "../../context/authentication";
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useAppContext } from '../../context/appContext'
import { collection, documentId, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../../utils'

const LastStep = ({ l }) => {
    const { firebase } = useFirebase()
    const { user } = useAuthentication()
    const { cart, forceSetCart } = useAppContext()
    const router = useRouter()

    const functions = getFunctions(firebase, "europe-west1")
    connectFunctionsEmulator(functions, "localhost", 5001);
    const createCheckout = httpsCallable(functions, "createCheckout")

    // const [tab, setTab] = useState("creditCardData")
    const [tab, setTab] = useState("checkAddress")
    const [currentCheckout, setCurrentCheckout] = useState()

    const [ccForm] = Form.useForm()
    const [addressForm] = Form.useForm()

    const handleCreateCheckout = async () => {
        try{
            if(!currentCheckout || !!currentCheckout?.error_code){
                const amount = user?.lastCart?.total
                if(!amount){ throw new Error("Falta el monto de la transacción") }
                const userData = addressForm.getFieldsValue()
                const { uid: userId, email } = user
                if(!userId && !userData.email){ throw new Error("Falta userId o email")}
                const { data: checkout } = await createCheckout({
                    userId,
                    email: email || userData.email,
                    amount: CarTwoTone.total,
                    userData,
                    description: `${new Date()} - ${email}`
                })
                if(checkout.error_code){
                    message.error("Ocurrió un error preparando la pasarela de pago. Inténtalo más tarde.")
                    console.log(checkout)
                    // router.push("/")
                }
                setCurrentCheckout(checkout)
                if(!checkout){
                    message.error("El pago no puede realizarse en estos instantes")
                    throw new Error()
                } else {
                    setTab("creditCardData")
                }
            } else {
                setTab("creditCardData")
            }
        } catch(err) {
            console.error(err)
        }
    }

    const handlePayment = async ({ name, number, expirationDate, cvv }) => {
        const expiry_month = dayjs(expirationDate).format("MM")
        const expiry_year = dayjs(expirationDate).format("YYYY")

        const paymentResp = await fetch(`https://api.sumup.com/v0.1/checkouts/${currentCheckout.id}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                payment_type: "card",
                card: {
                    name,
                    number,
                    expiry_month,
                    expiry_year,
                    cvv
                }
            })
        })
        console.log(paymentResp)
        try{
            const paymentData = await paymentResp.data()
            console.log(paymentData)
        } catch(err){}
        try{
            const paymentJSON = await paymentResp.json()
            console.log(paymentJSON)
        } catch(err){}
    }

    const checkPrices = async () => {
        const productsToCheck = (await getDocs(query(collection(firestore, "products"), where(documentId(), "in", (cart?.items || []).map(p => p.id))))).docs.map(p => {
            return {
                ...p.data(),
                id: p.id
            }
        })
        let flag = true
        const checkedCartItems = (cart?.items || []).map(it => {
            const serverItem = productsToCheck.find(pchk => pchk.id === it.id)
            if(serverItem.price !== it.price || serverItem.discountedPrice != it.discountedPrice){ flag = false }
            return {
                ...it,
                price: serverItem?.price,
                discountedPrice: serverItem?.discountedPrice,
            }
        })
        if(!flag){ 
            forceSetCart({
                items: checkedCartItems,
                total: checkedCartItems.reduce((acc, it) => acc + ((it.discountedPrice || it.price) * it.qty), 0)
            })
        }

        return flag
    }

    return (
        <Container l={l}>
            <h2>Finalizar compra</h2>
            <Wrapper>
                { tab === "checkAddress" && <InnerCart showAddress form={addressForm} handleSubmit={handleCreateCheckout} /> }
                { tab === "creditCardData" && <CreditCardForm form={ccForm} checkout={currentCheckout} handlePayment={handlePayment} /> }
            </Wrapper>
            <FlexWrapper>
                { tab === "creditCardData" && (
                    <Button
                        size="large"
                        onClick={() => setTab("checkAddress")}
                    >Volver a dirección</Button>
                )}
                <Button
                    type="primary"
                    size="large"
                    onClick={async () => {
                        const checkedPrices = await checkPrices()
                        if(checkedPrices){
                            if(tab === "checkAddress"){
                                addressForm.submit()
                            } else if(tab === "creditCardData"){
                                ccForm.submit() 
                            }
                        } else {
                            message.warning("Los precios han variado desde el momento en el que pusiste el artículo en la cesta. Revisa la cesta antes de continuar")
                        }
                    }}
                >{ tab === "checkAddress" ? "Finalizar compra" : "Efectuar pago" }</Button>
            </FlexWrapper>
        </Container>
    )
}

const Wrapper = styled.div`
    width: 100%;
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
  

export default LastStep