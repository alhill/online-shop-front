import styled from 'styled-components'
import Link from 'next/link'
import { useRef, useLayoutEffect, useState } from 'react'
import { get } from 'lodash'

const ProductCard = ({ item, l }) => {
    const ref = useRef()
    const mainPic = (item?.pictures || []).find(pic => pic.main) || { path: "./placeholder.jpg" }
    const [imgHeight, setImgHeight] = useState("auto")

    useLayoutEffect(() => {
        setImgHeight(get(ref, "current.clientWidth", "auto"))
    })

    return (
        <Wrapper ref={ref}>
            <Link href={`/${l}/producto/${item.slug || item.id}`}>
                <Img src={mainPic?.path} height={imgHeight} />
                <Title>{ l === "en" ? (item?.name_en || item?.name) : item?.name }</Title>
                <Price>{ item.price }€</Price>
            </Link>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: calc(25% - 1em);
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
    @media (max-width: 1000px) {
        width: calc(33% - 1em);
    }
    @media (max-width: 600px) {
        width: calc(50% - 1em);
    }
`

const Img = styled.img`
    width: 100%;
    height: ${({ height }) => height};
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
