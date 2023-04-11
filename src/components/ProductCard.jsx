import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const ProductCard = ({ item }) => {
    console.log(item)
    const mainPic = (item?.pictures || []).find(pic => pic.main) || { path: "./placeholder.jpg" }
    return (
        <Wrapper>
            <Link to={`/producto/${item.slug}`}>
                <Img src={mainPic?.path} />
                <Title>{ item.name }</Title>
                <Price>{ item.price }€</Price>
            </Link>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: calc(50vw - 3em);
    margin-bottom: 1em;
    overflow: hidden;
    transition: all 300ms ease-in-out;
    & * {
        text-decoration: none;
        color: #333;
    }
    &:hover{
        transform: scale(1.05);
    }
`

const Img = styled.img`
    width: 100%;
    height: calc(50vw - 3em);
    object-fit: cover;
    border-radius: 4px;
`

const Title = styled.p`
    margin: 0;
    padding: 0.5em 0;
`
const Price = styled.p`
    font-weight: bold;
    font-size: 1.2em;
`

export default ProductCard
