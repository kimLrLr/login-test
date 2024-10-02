import { Link } from "react-router-dom";
import styled from "styled-components";
import { routes } from "../../routes";
import { BtnCom } from "../../components/BtnCom";

const ConWrap = styled.div`
  width: 100vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const TextBox = styled.h3`
  font-weight: 700;
  margin-bottom: 20px;
`;

export const PageNotFound = () => {
  return (
    <ConWrap>
      <TextBox> 없는 페이지입니다. </TextBox>
      <Link to={routes.main}>
        <BtnCom btnName="메인화면으로" />
      </Link>
    </ConWrap>
  );
};
