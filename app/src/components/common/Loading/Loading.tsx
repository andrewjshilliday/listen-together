import React from 'react';
import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';

const Loading: React.FC = (props: any) => {  
  return (
    <LoadingContainer><CircularProgress /></LoadingContainer>
  );
}

export default Loading;


const LoadingContainer = styled.div`
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
`;
