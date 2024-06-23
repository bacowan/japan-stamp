'use client';

import styled from "styled-components"
import { small, medium, large } from "../lib/breakpoints";

const StyledLink = styled.a<{ isActive?: boolean; }>`
float: left;
color: black;
text-align: center;
padding: 12px;
text-decoration: none;
font-size: 18px; 
line-height: 25px;
border-radius: 4px;
background-color: ${ props => props.isActive ? "dodgerblue" : "" };
color: ${ props => props.isActive ? "white" : "" };
${ small(`
    float: none;
    display: block;
    text-align: left;
`) }
`;

const StyledRightLink = styled(StyledLink)<{ isActive?: boolean; }>`
    ${ small(`
        float: none;
        display: block;
        text-align: left;
    `) }
`;

const StyledRightDiv = styled.div`
    float: right;
    ${ small(`
        float: none;
    `) }
`

const StyledLogo = styled(StyledLink)`
    font-size: 25px;
    font-weight: bold;
    ${ small(`
        float: none;
        display: block;
        text-align: left;
    `) }
`
const StyledHeader = styled.div`
    overflow: hidden;
    background-color: #f1f1f1;
    padding: 20px 10px;
`
export default function Navbar() {
    return <StyledHeader>
            <StyledLogo>CompanyLogo</StyledLogo>
            <StyledRightDiv>
                <StyledRightLink isActive={true} href="#home">Home</StyledRightLink>
                <StyledRightLink href="#contact">Contact</StyledRightLink>
                <StyledRightLink href="#about">About</StyledRightLink>
            </StyledRightDiv>
        </StyledHeader>
}

