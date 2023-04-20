import { useState, useEffect } from 'react'
import { Button, Form, Input, Radio } from "antd";
import { Container, OrderTab, UserDataTab } from "../components"
import styled from 'styled-components'

const Profile = () => {

  const [tab, setTab] = useState("datos")

  return (
    <Container>
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default Profile