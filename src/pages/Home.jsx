import React, { useState, useEffect } from "react";
import { useAuthentication } from "../context/authentication";
import { useData } from '../context/dataProvider'
import { useHistory } from "react-router-dom";
import Container from "../components/Container";
import { FlexWrapper, ProductCard } from "../components";
import { Input } from "antd";
import { basicSearch } from "../utils";

const Home = () => {
  const history = useHistory();
  const { allProducts, tags, productsPerTag, featured, frontpageProducts } = useData()

  const [search, setSearch] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])

  // useEffect(() => {
    // console.log({ allProducts, tags, productsPerTag, featured, frontpageProducts })
  // }, [allProducts, tags, productsPerTag, featured, frontpageProducts])

  useEffect(() => {
    console.log(search)
    const filteredProducts = basicSearch(search, allProducts, ["name"])
    setFilteredProducts(filteredProducts)
  }, [allProducts, search])

  return (
    <Container>
      <Input.Search
        value={search}
        onChange={evt => setSearch(evt.target.value)}
        style={{ marginBottom: "1em" }}
        allowClear={true}
        placeholder="Buscar"
      />
      <FlexWrapper justify="space-between">
        { filteredProducts.map(p => {
          return (
            <ProductCard
              item={p}
            />
          )
        })}
      </FlexWrapper>
    </Container>
  );
};

export default Home
