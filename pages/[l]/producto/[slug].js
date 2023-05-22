import { useState, useRef } from "react";
import styled from 'styled-components'
import { Container } from "../../../components";
import { Button, Tooltip } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { firestore, t } from "../../../utils";
import { query, collection, getDocs, where, doc, getDoc, documentId } from "firebase/firestore";
import { useAppContext } from "../../../context/appContext";
import { useLayoutEffect } from "react";
import { get } from 'lodash'
import Link from "next/link";

const Product = ({ product, l, variants }) => {

  const { mutateCart, setCartModal } = useAppContext()
  const [imgHeight, setImgHeight] = useState("auto")
  const imgRef = useRef(null)

  useLayoutEffect(() => {
    setImgHeight(get(imgRef, "current.clientWidth", "auto"))
  })

  return (
    <Container loading={product?.loading} l={l}>
      <Flexito>
        <MainImg 
          ref={imgRef} 
          src={
            (product?.pictures || []).find(pic => pic.main)?.path ||
            (product?.pictures || [])[0]?.path ||
            "http://localhost:3000/placeholder.jpg"
          } 
          height={imgHeight}
        />
        <DescriptionBox>
          <TextWrapper>
            <Title>{ l === "en" ? (product?.name_en || product?.name) : product?.name  }</Title>
            { product?.description && <Description>{ l === "en" ? (product?.description_en || product?.description) : product?.description }</Description> }
            { product?.price && <Price>{ product?.price }€</Price> }
          </TextWrapper>
          { Array.isArray(variants) && variants.length > 0 && (
            <VariantWrapper>
              { variants.map((v, i) => (
                <abbr
                  title={v.name}
                >
                  <Link 
                    href={(v.id === product.id) ? "#" : `/${l}/producto/${v.slug || v.id}`}
                  >
                    <VariantSquare
                      key={`variant-${v.id}`}
                      lastOne={variants.length === i+1}
                      selected={v.selected}
                    >
                      <img src={(Array.isArray(v?.pictures) && v.pictures[0]?.url) ? v.pictures[0].url : "http://localhost:3000/placeholder.jpg"} />
                    </VariantSquare>
                  </Link>
                </abbr>
              ))}
            </VariantWrapper>
          )}
          <div>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={() => {
                mutateCart(product.slug || product.id, 1)
                setCartModal(true)
              }}
            >{t(l, "addToCart")}</Button>
          </div>
        </DescriptionBox>
      </Flexito>
    </Container>
  );
};

const MainImg = styled.img`
  width: 50%;
  max-width: 400px;
  height: ${({ height }) => height}px;
  max-height: 400px;
  object-fit: cover;
  border-radius: 4px;
  @media (max-width: 500px){
    margin-bottom: 1em;
    width: 100%;
    height: calc(100vw - 4em);
    max-width: calc(100vw - 4em);
  }
`
const TextWrapper = styled.div`
  width: 100%;
`

const VariantWrapper = styled.div`
  display: flex;
`

const VariantSquare = styled.div`
  border-radius: 3px;
  border: ${({ selected }) => selected ? "2px solid #aaa" : "none"};
  height: 40px;
  width: 40px;
  margin-bottom: 2em;
  margin-right: ${({ lastOne }) => lastOne ? "0px" : "12px"};
  overflow: hidden;
  transition: all 300ms;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &:hover {
    transform: scale(1.1);
  }
`

const Title = styled.h2``
const Description = styled.p``
const Price = styled.h3`
  font-weight: bold;
  font-size: 1.5em;
  margin-bottom: 1em;
`

const DescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  @media (min-width: 500px){
    margin-left: 2em;
  }
`

const Flexito = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex: 1;
  justify-content: space-between;
  @media (max-width: 500px){
    flex-direction: column;
    justify-content: center;
  }
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

  let snapshot
  try{
    snapshot = (await getDocs(q)).docs[0]
    product = { ...snapshot.data(), id: snapshot.id }
  } catch(err) {
    try{
      snapshot = await getDoc(doc(firestore, "products", slug))
      product = { ...snapshot.data(), id: snapshot.id }
    } catch(err) {}
  }

  let variants = []
  if(product?.variantGroup){
    try{
      const varGroupSnapshot = await getDoc(doc(firestore, "variants", product.variantGroup))
      const varGroupIds = varGroupSnapshot.data().items || []
      const qv = query(collection(firestore, "products"), where(documentId(), "in", varGroupIds))
      variants = (await getDocs(qv)).docs.map(s => {
        const variant = s.data()
        return {
          ...variant,
          id: s.id,
          selected: s.id === snapshot?.id
        }
      })
    } catch(err) {
      console.log(err)
    }
  }

  return {
    props: { 
      product,
      variants,
      l
    }
  }
}

export default Product