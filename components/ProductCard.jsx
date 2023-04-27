import styled from 'styled-components'
import Link from 'next/link'

const ProductCard = ({ item, l }) => {
    const mainPic = (item?.pictures || []).find(pic => pic.main) || { path: "./placeholder.jpg" }
    return (
        <Wrapper>
            <Link href={`/${l}/producto/${item.slug || item.id}`}>
                <Img src={mainPic?.path} />
                <Title>{ l === "en" ? (item?.name_en || item?.name) : item?.name }</Title>
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
