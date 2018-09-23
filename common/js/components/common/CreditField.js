import React, { Component } from 'react';
import styled from 'styled-components';
// import CreditBalloon from '@components/common/CreditBalloon';
import FieldContainer from '@components/common/FieldContainer';
import TextInput from '@components/common/TextInput';
import QuestionTitle from '@components/common/QuestionTitle';
import Error from '@components/common/Error';

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SelectWrapper = styled.div`
  height: 40px;
  margin-right: 20px;
`;

const yearStart = parseInt(`${new Date().getFullYear()}`.slice(2), 10) - 1;

export default class CreditField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      credit: null,
    };
  }
  static defaultProps = {
    onChangeNumber: () => {},
    onChangeMonth: () => {},
    onChangeYear: () => {},
    onChangeSecurity: () => {},
    numberName: 'cardNumber',
    monthName: 'cardExpirationMonth',
    yearName: 'cardExpirationYear',
    securityName: 'security_code',
  }

  _creditChange = (e) => {
    const {
      onChangeNumber,
      numberName,
    } = this.props;
    const value = e.target.value;
    const trueValue = value.split('-').join('');

    onChangeNumber(numberName, trueValue);

    const creditValues = [];
    [...Array(4)].forEach((prop, index) => {
      const tempValue = trueValue.slice(index * 4, (index + 1) * 4);

      if (!tempValue) return false;

      creditValues.push(tempValue);
    });
    const creditValue = creditValues.join('-');

    this.setState({
      credit: creditValue,
    });
  }

  render() {
    const {
      onChangeNumber,
      onChangeMonth,
      onChangeYear,
      onChangeSecurity,
      numberName,
      monthName,
      yearName,
      securityName,
      errors,
      isCenter
    } = this.props;
    const {
      credit,
    } = this.state;

    return (
      <div>
        <FieldContainer>
          <div>
            <Error error={errors[numberName]} />
            <QuestionTitle
              noQuestion
              isRequire
              isCenter={isCenter ? 'isCenter' : ''}
            >
              カード番号
            </QuestionTitle>
          </div>
          <TextInput
            type="tel"
            name={numberName}
            maxLength="19"
            value={credit}
            className="ac-c-input"
            placeholder="0000-0000-0000-0000"
            onChange={this._creditChange}
          />
        </FieldContainer>

        <FieldContainer>
          <div>
            <Error
              error={
                (errors[monthName] || errors[yearName]) &&
                `${errors[monthName]} ${errors[yearName]} を入力してください`
              }
            />
            <QuestionTitle
              noQuestion
              isRequire
              isCenter={isCenter ? 'isCenter' : ''}
            >
              有効期限
            </QuestionTitle>
          </div>
          <InputWrapper>
            <SelectWrapper>
              <select
                className="ac-c-select"
                name={monthName}
                onChange={onChangeMonth}
              >
                {[...Array(13)].map((key, i) =>
                  <option key={i} value={i === 0 ? '' : (`0${parseInt(i, 10)}`).slice(-2)}>{i === 0 ? '選択してください' :`${i}月`}</option>,
                )}
              </select>
            </SelectWrapper>
            <SelectWrapper>
              <select
                name={yearName}
                className="ac-c-select"
                onChange={onChangeYear}
              >
                {[...Array(20)].map((key, i) =>
                  <option key={i} value={(`0${parseInt(i + yearStart, 10)}`).slice(-2)}>{i === 0 ? '選択してください' : `${i + yearStart}年`}</option>,
                )}
              </select>
            </SelectWrapper>
          </InputWrapper>
        </FieldContainer>

        <FieldContainer>
          <div>
            <Error error={errors[securityName]} />
            <QuestionTitle
              noQuestion
              isRequire
              isCenter={isCenter ? 'isCenter' : ''}
            >
              セキュリティコード
            </QuestionTitle>
          </div>
          <TextInput
            type="tel"
            name={securityName}
            maxLength="4"
            pattern="\d*"
            placeholder="0000"
            onChange={onChangeSecurity}
          />
        </FieldContainer>
      </div>
    );
  }
}
