import { useState } from "react";
import styled from 'styled-components'
import { Container } from "../../components";
import { Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { firestore } from "../../utils";
import { query, collection, getDocs, where, doc, getDoc } from "firebase/firestore";
import { useAppContext } from "../../context/appContext";

const Product = ({ product }) => {

  const { mutateCart, setCartModal } = useAppContext()

  return (
    <Container loading={product?.loading}>
      <MainImg src={
        (product?.pictures || []).find(pic => pic.main)?.path || 
        (product?.pictures || [])[0]?.path || 
        "http://localhost:3000/placeholder.jpg"
      } />
      <br />
      <TextWrapper>
        <Title>{ product?.name }</Title>
        { product?.description && <Description>{ product?.description }</Description> }
        { product?.price && <Price>{ product?.price }€</Price> }
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

export async function getStaticPaths() {
  const paths = (await getDocs(query(collection(firestore, "products")))).docs.map(doc => ({ 
    params: { 
    slug: doc.data().slug || doc.id, 
  }}))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps(props) {
  const slug = props?.params?.slug
  const q = query(collection(firestore, "products"), where("slug", "==", slug))

  let product = null
  let productPerId = null

  try{
    product = (await getDocs(q)).docs[0].data()
  } catch(err) {}

  try{
    productPerId = (await getDoc(doc(firestore, "products", slug))).data()
  } catch(err) {}

  return {
    props: { product: product || productPerId }
  }
}

export default Product