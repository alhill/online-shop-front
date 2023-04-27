import { useState } from "react";
import styled from 'styled-components'
import { Container } from "../../../components";
import { Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { firestore, t } from "../../../utils";
import { query, collection, getDocs, where, doc, getDoc } from "firebase/firestore";
import { useAppContext } from "../../../context/appContext";

const Product = ({ product, l }) => {

  const { mutateCart, setCartModal } = useAppContext()

  return (
    <Container loading={product?.loading} l={l}>
      <MainImg src={
        (product?.pictures || []).find(pic => pic.main)?.path || 
        (product?.pictures || [])[0]?.path || 
        "http://localhost:3000/placeholder.jpg"
      } />
      <br />
      <TextWrapper>
        <Title>{ l === "en" ? (product?.name_en || product?.name) : product?.name  }</Title>
        { product?.description && <Description>{ l === "en" ? (product?.description_en || product?.description) : product?.description }</Description> }
        { product?.price && <Price>{ product?.price }€</Price> }
      </TextWrapper>
      <Button
        type="primary"
        icon={<ShoppingCartOutlined />}
        onClick={() => {
          mutateCart(product.slug || product.id, 1)
          setCartModal(true)
        }}
      >{t(l, "addToCart")}</Button>
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

export async function getStaticPaths(props) {
  const slugs = (await getDocs(query(collection(firestore, "products")))).docs.map(doc => (doc.data().slug || doc.id))

  const localePaths = slugs.map(slug => ([
    { params: { slug, l: "es" }},
    { params: { slug, l: "en" }}
  ])).flat()

  return {
    paths: localePaths,
    fallback: false
  }
}

export async function getStaticProps(props) {
  console.log(props)
  const slug = props?.params?.slug
  const l = props?.params?.l
  const q = query(collection(firestore, "products"), where("slug", "==", slug))

  let product = null
  let productPerId = null

  try{
    const snapshot = (await getDocs(q)).docs[0]
    product = { ...snapshot.data(), id: snapshot.id }
  } catch(err) {}

  try{
    const snapshot = await getDoc(doc(firestore, "products", slug))
    productPerId = { ...snapshot.data(), id: snapshot.id }
  } catch(err) {}

  return {
    props: { 
      product: product || productPerId ,
      l
    }
  }
}

export default Product