import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {BREAKPOINT, COLORS} from '@constants/index';

const Title = styled.p`
  color: ${COLORS.HYPER_DARK_GRAY};
  font-size: 16px;
  font-weight: bold;
  display: flex;
  margin-bottom: 15px;
  &.is-thin {
    font-weight: normal;
    font-size: 14px;
    margin-bottom: 0px;
    color: ${COLORS.SUPER_DARK_GRAY};
  }
  ${props => props.leftBorder ? 
    `
    border-left: 3px solid ${COLORS.DARK_GRAY};
    padding-left: 10px;
    `: ``
  }
  ${props => props.isCenter ?
    `
    justify-content: center;
    `: ``
  }
`;

const Description = styled.span`
  display: inline-block;
  margin-left: 1.2em;
  text-indent: -1.2em;
  font-size: 16px;
  @media (max-width: ${BREAKPOINT.TABLET}px) {
    font-size: 14px;
  }

  &:before {
    ${props => props.noQuestion ?
      `content: '';`: 
      `content: 'Q. ';`
    };
  }
`;

const Label = styled.span`
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  margin-bottom: 2px;
  margin-left: 3px;
  text-indent: 0;
  ${props => props.isOption ? 
    `color: ${COLORS.WHITE};
     background-color: ${COLORS.GRAY};`:
    ``
  }
  ${props => props.isRequire ?
    `color: ${COLORS.WHITE};
    background-color: ${COLORS.MAIN};` :
    ``
  }
`;

const QuestionTitle = (props) => {
  const {
    children,
    label,
    isRequire,
    isOption,
    requireLabel,
    optionLabel,
    noQuestion,
    leftBorder,
    isCenter,
  } = props;

  let overridedLabel;

  if (isRequire) {
    overridedLabel = requireLabel;
  } else if (isOption) {
    overridedLabel = optionLabel;
  } else {
    overridedLabel = label;
  }

  return (
    <Title
      leftBorder={leftBorder}
      isCenter={isCenter}
    >
      <Description noQuestion={noQuestion}>
        {children}
        {overridedLabel &&
          <Label
            isRequire={isRequire}
            isOption={isOption}
          >
            {overridedLabel}
          </Label>
        }
      </Description>
    </Title>
  );
};

QuestionTitle.defaultProps = {
  requireLabel: '必須',
  optionLabel: '任意',
};

QuestionTitle.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  requireLabel: PropTypes.string,
  isRequire: PropTypes.bool,
  optionLabel: PropTypes.string,
  isOption: PropTypes.bool,
  noQuestion: PropTypes.bool,
  leftBorder: PropTypes.bool,
  isCenter: PropTypes.bool,
};

export default QuestionTitle;
