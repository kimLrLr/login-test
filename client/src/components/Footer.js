import styled from "styled-components";

const Container = styled.footer`
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #333;
`;

export const Footer = () => {
  return <Container>&copy; 2024 kimLrLr</Container>;
};
