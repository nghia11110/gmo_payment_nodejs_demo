import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
  display: block;
  margin-top: 44px;
  margin-bottom: 44px;
`;

const FieldContainer = (props) => {

  return (
    <Div>
      {props.children[0]}
      {props.children[1]}
    </Div>
  );
};

export default FieldContainer;
