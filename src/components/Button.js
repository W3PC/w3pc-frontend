import styled, { css } from 'styled-components'

const Button = styled.button`
  color: white;
  background-color: #ff7a00;
  font-size: 1.5em;
  padding: 0.8em;
  margin-right: 5%;
  border: 1px solid #ff7a00;
  border-radius: 5px;
  ${(props) =>
    props.primary &&
    css`
      background-color: #4786ff;
      border: 1px solid #4786ff;
      padding: 0.5rem;
      font-size: 1.5rem;
    `}
`

export default Button
