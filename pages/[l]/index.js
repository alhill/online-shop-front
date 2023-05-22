import { useState, useEffect } from "react";
import { FlexWrapper, ProductCard, Container } from "../../components";
import { Button, Collapse, Divider, Input, Pagination, Select, Form, Checkbox } from "antd";
import { basicSearch, firestore, t, cleanStr } from "../../utils";
import { query, collection, getDocs, getDoc, doc } from "firebase/firestore";
import _ from "lodash";
import styled from "styled-components";
import { FilterOutlined } from "@ant-design/icons";

const Home = ({ products, l, tags, featured, frontpage, bannerPics }) => {
  const [search, setSearch] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showedProducts, setShowedProducts] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(16)
  const [openFilter, setOpenFilter] = useState(false)
  const [sortBy, setSortBy] = useState("default")
  const [selectedTags, setSelectedTags] = useState([])

  useEffect(() => {
    const search = window?.location?.search || ""
    if(search.includes("?p=")){
      const n = parseInt(search.replace("?p=", ""))
      if(!Number.isNaN(n)){
        setPage(n)
      }
    }
  }, [])

  useEffect(() => {
    const productsWithFrontpageFront = _.uniqBy([
      ...frontpage,
      ...products
    ], "id")
    const filteredProducts = basicSearch(search, productsWithFrontpageFront || [], ["name"]).filter(p => {
      if(selectedTags.length === 0){ return true }
      else {
        console.log(p.tags, selectedTags)
        return _.intersection(p.tags, selectedTags).length > 0
      }
    })
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if(sortBy === "default"){ return }
      else if(sortBy === "priceUp"){ return a.price > b.price ? 1 : -1}
      else if(sortBy === "priceDown"){ return a.price < b.price ? 1 : -1}
      else if(sortBy === "az"){ return cleanStr(a.name) > cleanStr(b.name) ? 1 : -1}
      else if(sortBy === "za"){ return cleanStr(a.name) < cleanStr(b.name) ? 1 : -1}
    })
    setFilteredProducts(sortedProducts)
    const productChks = _.chunk(sortedProducts, pageSize)
    if(page <= productChks.length){
      setShowedProducts(productChks[page - 1])
    } else {
      setPage(1)
      window.history.pushState("page1", "", `?p=1`)
      setShowedProducts(productChks[0])
    }
  }, [products, search, page, pageSize, sortBy, selectedTags])

  return (
    <Container 
      l={l}
      topBanner={bannerPics}
    >
      <div style={{ textAlign: "left", width: "100%" }}>
        <h3>{t(l, "featuredProducts")}</h3>
      </div>
      <FlexWrapper justify="space-between">
        { featured.map(p => {
          return (
            <ProductCard
              item={p}
              key={p.id}
              l={l}
            />
          )
        })}
      </FlexWrapper>
      <Divider style={{ marginTop: 0 }} />

      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <Input.Search
          value={search}
          onChange={evt => setSearch(evt.target.value)}
          style={{ marginBottom: "1em", maxWidth: 500, flex: 1 }}
          allowClear={true}
          placeholder={t(l, "search")}
        />
        <Button 
          icon={<FilterOutlined style={{ color: (openFilter || selectedTags.length > 0) ? "orange" : "rgba(0, 0, 0, 0.45)" }} />} 
          style={{ 
            marginLeft: "1em", 
            width: 38,
            borderColor: (openFilter || selectedTags.length > 0) ? "orange" : "rgba(0, 0, 0, 0.15)"
          }}
          onClick={() => setOpenFilter(!openFilter)}
        >
        </Button>
      </div>
      <FilterControls>
        <Collapse 
          activeKey={openFilter ? "filter" : null}
        >
          <Collapse.Panel key="filter" showArrow={false}>
            <Form layout="vertical">
              <Form.Item label={t(l, "orderBy")}>
                <Select
                  value={sortBy}
                  onChange={v => setSortBy(v)}
                  style={{ maxWidth: 150 }}
                >
                  <Select.Option value="default">{t(l, "relevance")}</Select.Option>
                  <Select.Option value="priceUp">{t(l, "priceUp")}</Select.Option>
                  <Select.Option value="priceDown">{t(l, "priceDn")}</Select.Option>
                  <Select.Option value="az">{t(l, "azUp")}</Select.Option>
                  <Select.Option value="za">{t(l, "azDn")}</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label={t(l, "categories")}>
                <Checkbox.Group
                  options={tags}
                  style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}
                  onChange={selTags => setSelectedTags(selTags)}
                />
              </Form.Item>
            </Form>
          </Collapse.Panel>
        </Collapse>
      </FilterControls>
      <FlexWrapper justify="space-between">
        {(showedProducts || []).map(p => {
          return (
            <ProductCard
              item={p}
              key={p.id}
              l={l}
            />
          )
        })}
      </FlexWrapper>
      <Pagination
        current={page}
        showLessItems={true}
        onChange={page => {
          setPage(page)
          window.history.pushState(`page${page}`, "", `?p=${page}`)
        }}
        showSizeChanger
        defaultPageSize={16}
        pageSizeOptions={[16, 32, 64]}
        onShowSizeChange={(page, size) => {
          setPageSize(size)
          setPage(1)
          window.history.pushState("page1", "", `?p=1`)
        }}
        total={Array.isArray(filteredProducts) ? filteredProducts.length : 0}
      />
    </Container>
  );
};

const FilterControls = styled.div`
  width: 100%;
  .ant-collapse-header {
    padding: 0 !important;
    height: 0;
  }
  .ant-collapse, .ant-collapse-item, .ant-collapse-content {
    border: none !important;
  }
  .ant-collapse-content-box{
    padding: 1em 0 !important;
  }
  .ant-checkbox-wrapper{
    margin: 0 10px 8px 0;
    width: 140px;
  }
`

export async function getStaticProps(props) {
  const l = props?.params?.l || "es"
  const loadData = async () => {
    const p = (await getDocs(query(collection(firestore, "products")))).docs.map(doc => ({ ...doc.data(), id: doc.id }))
    const config = (await getDoc(doc(collection(firestore, "config"), "1"))).data()

    return {
      products: p.filter(it => it.active),
      frontpage: p.filter(it => it.active && it.frontpage),
      featured: p.filter(it => it.active && it.featured),
      tags: (config?.tags || []),
      bannerPics: (config?.bannerPics || [])
    }
  }
  const data = await loadData()

  console.log({ data })

  return {
    props: {
      products: (data?.products || []).map(p => p || null), 
      tags: (data?.tags || []).map(t => t || null),
      featured: (data?.featured || []).map(p => p || null),
      frontpage: (data?.frontpage || []).map(p => p || null),
      bannerPics: (data?.bannerPics || []).map(p => p?.url || null),
      l
    }
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


export default Home
