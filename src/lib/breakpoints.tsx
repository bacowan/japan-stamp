import { css } from 'styled-components'

const device = {
  sm: '600px',
  md: '900px',
  lg: '1280px',
}
export const small = (inner: string) => css`
  @media (max-width: ${device.sm}) {
    ${inner};
  }
`;
export const medium = (inner: string) => css`
  @media (max-width: ${device.md}) {
    ${inner};
  }
`;
export const large = (inner: string) => css`
  ${inner};
`;