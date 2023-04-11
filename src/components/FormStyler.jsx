import React from 'react'
import styled from 'styled-components'

const FormStyler = ({ children }) => {
    return (
        <Wrapper>
            { children }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    max-width: 500px;
    .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input,
    .ant-input-affix-wrapper-status-error:not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper{
        border-color: fuchsia;
    }
    .ant-form-item-explain-error, .ant-form-item .ant-form-item-label >label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before{
        color: fuchsia;
    }
`

export default FormStyler