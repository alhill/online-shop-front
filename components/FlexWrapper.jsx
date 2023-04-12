import styled from 'styled-components'

const FlexWrapper = ({ 
    children, 
    justify = "space-evenly", 
    margin = "1em 0",
    style
}) => {
    return (
        <Wrapper justify={justify} margin={margin} style={style}>
            { children }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: ${({ justify }) => justify};
    margin: ${({ margin }) => margin};
    flex-wrap: wrap;

`

export default FlexWrapper