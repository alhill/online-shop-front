import React, { useState, useEffect } from "react";
import styled from 'styled-components'
import { Container } from "../components";
import { useParams } from "react-router-dom";
import { useData } from "../context/dataProvider";
import { add, get } from "lodash";
import { Button, Modal } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const Product = () => {

  const { slug } = useParams()
  const { allProducts, mutateCart, setCartModal } = useData()

  const [product, setProduct] = useState({ loading: true })

  useEffect(() => {
    const product = allProducts.find(it => it.active && it.slug === slug)
    if(product){
      const mainImg = (product?.pictures || []).find(img => img.main) || (get(product, "pictures[0]", { path: "http://localhost:3000/placeholder.jpg" }))
      setProduct({
        ...product,
        mainImg
      })
    }
  }, [slug, allProducts])

  return (
    <Container loading={product?.loading}>
      <MainImg src={product?.mainImg?.path} />
      <br />
      <TextWrapper>
        <Title>{ product.name }</Title>
        { product.description && <Description>{ product.description }</Description> }
        { product.price && <Price>{ product.price }€</Price> }
      </TextWrapper>
      <Button
        type="primary"
        icon={<ShoppingCartOutlined />}
        onClick={() => {
          mutateCart(product.slug, 1)
          setCartModal(true)
        }}
      >Añadir a la cesta</Button>
    </Container>
  );
};

const MainImg = styled.img`
  width: 100%;
  max-width: calc(100vw - 4em);
  height: calc(100vw - 4em);
  object-fit: cover;
  border-radius: 4px;
`
const TextWrapper = styled.div`
  width: 100%;
`
const Title = styled.h2``
const Description = styled.p``
const Price = styled.h3`
  font-weight: bold;
  font-size: 1.5em;
`

export default Product