import { useState, useEffect } from "react";
import Container from "../components/Container";
import { FlexWrapper, ProductCard } from "../components";
import { Input } from "antd";
import { basicSearch, firestore } from "../utils";
import { query, collection, getDocs, getDoc, doc } from "firebase/firestore";

const Home = ({ products }) => {
  const [search, setSearch] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    const filteredProducts = basicSearch(search, products || [], ["name"])
    setFilteredProducts(filteredProducts)
  }, [products, search])

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
              key={p.id}
            />
          )
        })}
      </FlexWrapper>
    </Container>
  );
};

export async function getStaticProps() {
  const loadData = async () => {
    const p = (await getDocs(query(collection(firestore, "products")))).docs.map(doc => ({ ...doc.data(), id: doc.id }))
    const config = (await getDoc(doc(collection(firestore, "config"), "1"))).data()
    return {
      products: p.filter(it => it.active),
      tags: (config?.tags || [])
    }
  }
  const data = await loadData()

  return {
    props: {
      products: (data?.products || []).map(p => p || null), 
      tags: (data?.tags || []).map(t => t || null)
    }
  }
}

export default Home
