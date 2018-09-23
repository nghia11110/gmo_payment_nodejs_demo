import React from 'react';
import styled from 'styled-components';
import { COLORS } from '@constants/index';


const Input = styled.input`
  border: solid 1px ${COLORS.LIGHT_GRAY};
  padding: 16px;
  font-size: 14px;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  background-color: ${props => props.disabled ? COLORS.SUPER_LIGHT_GRAY : COLORS.WHITE};
  ${props => props.disabled ? `pointer-events : none;` : ``}
  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${COLORS.LIGHT_GRAY};
    opacity: 1; /* Firefox */
  }
`;

const TextInput = (props) => {
  return (
    <Input
      type="text"
      {...props}
      disabled={ props.disabled ? "disabled" : '' }
    />
  );
};

export default TextInput;
