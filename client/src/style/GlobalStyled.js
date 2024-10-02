import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyled = createGlobalStyle`

    ${reset}

    *{
        box-sizing: border-box;
    }

    ul, li{
        list-style: none;
    }

    a{
        text-decoration: none;
        color: #333;
    }

    body{
        letter-spacing: -1px;
        word-break: keep-all;
    }

`;
