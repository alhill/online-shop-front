import { useState, useEffect } from 'react'
import { Button, Form, Input, Radio } from "antd";
import { Container, OrderTab, UserDataTab } from "../../components"
import styled from 'styled-components'
import { useAuthentication } from '../../context/authentication';
import { useRouter } from 'next/router';

const Profile = ({ l }) => {

  const [tab, setTab] = useState("datos")
  const { user, loadingAuth } = useAuthentication()
  const router = useRouter()

  useEffect(() => {
    if(!user && !loadingAuth){
      router.push(`/${l}/?login`)
    }
  }, [user, loadingAuth])

  return (
    <Container l={l}>
        <Radio.Group
          buttonStyle='solid'
          optionType='button'
          options={[
            { label: "Mis datos", value: "datos" },
            { label: "Mis pedidos", value: "pedidos" }
          ]}
          value={tab}
          onChange={evt => setTab(evt.target.value)}
        />
        <br />
        { tab === "datos" && (
          <UserDataTab />
        )}
        { tab === "pedidos" && (
          <OrderTab />
        )}
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

export default Profile