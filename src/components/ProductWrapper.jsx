import React from 'react'
import styled from 'styled-components'

const ProductWrapper = ({ children }) => {
    return <Wrapper>
        { children }
    </Wrapper>
}

const Wrapper = styled.div`

`

export default ProductWrapper
