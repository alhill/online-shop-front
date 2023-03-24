import React, { useState, useEffect } from "react";
import { useAuthentication } from "../context/authentication";
import { useData } from '../context/dataProvider'
import { useHistory } from "react-router-dom";
import Container from "../components/Container";

const Home = () => {
  const { push } = useHistory();
  const { allProducts, tags, productsPerTag, featured, frontpageProducts } = useData()

  // useEffect(() => {
  //   console.log({ allProducts, tags, productsPerTag, featured, frontpageProducts })
  // }, [allProducts, tags, productsPerTag, featured, frontpageProducts])

  return (
    <Container>

    </Container>
  );
};

export default Home
