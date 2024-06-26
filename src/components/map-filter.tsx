'use client'

import { useState } from "react"
import { FaFilter } from "react-icons/fa"
import styled from "styled-components"

const StyledContainer = styled.div`
  position: absolute;
  top: 1em;
  right: 1em;
  z-index: 1;
  background-color: lightgray;
  border-color: black;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
  user-select: none;
`

const StyledFilterCollapserHitbox = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
`

const StyledFilterCollapser = styled.div`
  margin: 0.3em;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export default function MapFilter() {

    const [isOpen, setIsOpen] = useState(false);

    return <StyledContainer>
        <StyledFilterCollapserHitbox onClick={() => setIsOpen(i => !i)}>
            <StyledFilterCollapser>
                <FaFilter/>
                <span>Filter</span>
            </StyledFilterCollapser>
        </StyledFilterCollapserHitbox>
        {isOpen && 
        <div>
            hi</div>}
    </StyledContainer>
}