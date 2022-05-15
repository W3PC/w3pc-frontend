import styled, { css } from 'styled-components'

const Button = styled.button`
  color: white;
  font-size: 1em;
  padding: 0.5em;
  background-color: #101826;
  border: 1px solid #101826;
  border-radius: 5px;

  &:hover {
    background-color: #64748b;
    border-color: #64748b;
    cursor: pointer;
  }

  @media (min-width: 576px) {
  }
  @media (min-width: 768px) {
  }
  @media (min-width: 992px) {
  }

  ${(props) =>
    props.primary &&
    css`
      background-color: #4786ff;
      border: 1px solid #4786ff;
      padding: 0.5rem;
      font-size: 1.5rem;
    `}
  ${(props) =>
    props.green &&
    css`
      background-color: #24803d;
      border: 1px solid #24803d;
      padding: 0.5rem;
      font-size: 1rem;

      &:hover {
        background-color: #245e3d;
        border-color: #245e3d;
      }
      @media (min-width: 576px) {
      }
      @media (min-width: 768px) {
        font-size: 1.5rem;
      }
      @media (min-width: 992px) {
      }
    `}
  ${(props) =>
    props.copy &&
    css`
      color: white;
      background: #101826;
      border: 1px solid #101826;
      border-radius: 5px;
      font-size: 1rem;
      margin-top: 0.5em;
      padding: 1px 6px;

      &:hover {
        border-color: #64748b;
        background: #64748b;
      }
    `}
`

export default Button
