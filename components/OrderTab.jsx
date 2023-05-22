import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Form, Input, Button, message } from 'antd'  
import { useAuthentication } from '../context/authentication'
import { FormStyler } from '.' 
import Link from 'next/link'
import { firestore } from '../utils'
import { getDocs, doc, collection } from 'firebase/firestore'

const UserDataTab = () => {
    const [userForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([])
    
    const { user } = useAuthentication()

    useEffect(() => {
        if(user?.uid){
            (async () => {
                const ref = collection(firestore, `users/${user.uid}/orders`)
                const docs = (await getDocs(ref)).docs
                const orders = docs.map(doc => ({ ...doc.data(), id: doc.id }))

                console.log({ orders, user })
                setOrders(orders)
                setFilteredOrders(orders)
            })()
        }
    }, [user])
    
    return (
        <Wrapper>
            <h3>Pedidos</h3>
            {(orders || []).length === 0 ? <p style={{ color: "#aaa" }}>No hay pedidos</p> : (
                <TableWrapper>
                    {(orders || []).map((or, i) => {
                        return (
                            <Row>{ JSON.stringify(or) }</Row>
                        )
                    })}
                </TableWrapper>
            )} 
        </Wrapper>
    )
}
    
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

const TableWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const Row = styled.div`
    display: flex
`
    
export default UserDataTab
    