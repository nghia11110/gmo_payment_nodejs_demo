import React from 'react';
import {
  withFormik,
} from 'formik';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import CreditField from '@components/common/CreditField';
import TextInput from '@components/common/TextInput';
import FieldContainer from '@components/common/FieldContainer';
import QuestionTitle from '@components/common/QuestionTitle';
import gmoConfig from '@utils/gmo/config';

const {
  SHOP_CONFIG,
  // SITE_CONFIG,
} = gmoConfig;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DivContainer = styled.div`
  width: 100%;
  display: flex;
  * {
    :first-child {
      margin-right: 5px;
    }
    :last-child {
      margin-left: 5px;
    }
  }
`;

const FIELD_NAMES = {
  memberId: 'member_id',
  memberName: 'member_name',
  price: 'price',
  cardNumber: 'card_number',
  expireMonth: 'expire_month',
  expireYear: 'expire_year',
  securityCode: 'security_code',
};

const VALIDATIONS = [{
  key: 'member_id',
  error: 'member_idを入力してください',
},{
  key: 'member_name',
  error: 'member_nameを入力してください',
},{
  key: 'price',
  error: '価格を入力してください',
},{
  key: 'card_number',
  error: 'カード番号を入力してください',
}, {
  key: 'expire_month',
  error: '有効期限（月）',
}, {
  key: 'expire_year',
  error: '有効期限（年）',
}, {
  key: 'security_code',
  error: 'セキュリティコードを入力してください',
}];

const GmoPaymentForm = (props) => {
  const {
    handleSubmit,
    handleChange,
    errors,
    setFieldValue,
    values,
  } = props;
  const errorLength = Object.keys(errors).length;
  return (
    <form onSubmit={handleSubmit}>
      決済情報を入力してください。
      <FieldContainer>
        <QuestionTitle isRequire noQuestion isCenter>
          Member_Id
        </QuestionTitle>
        <DivContainer>
          <TextInput
            onChange={handleChange}
            name={FIELD_NAMES.memberId}
            id={FIELD_NAMES.memberId}
          />
        </DivContainer>
      </FieldContainer>
      <FieldContainer>
        <QuestionTitle isRequire noQuestion isCenter>
          Member_Name
        </QuestionTitle>
        <DivContainer>
          <TextInput
            onChange={handleChange}
            name={FIELD_NAMES.memberName}
            id={FIELD_NAMES.memberName}
          />
        </DivContainer>
      </FieldContainer>
      <FieldContainer>
        <QuestionTitle isRequire noQuestion isCenter>
          Price
        </QuestionTitle>
        <DivContainer>
          <TextInput
            onChange={handleChange}
            name={FIELD_NAMES.price}
            id={FIELD_NAMES.price}
          />
        </DivContainer>
      </FieldContainer>
      <CreditField
        numberName={FIELD_NAMES.cardNumber}
        monthName={FIELD_NAMES.expireMonth}
        yearName={FIELD_NAMES.expireYear}
        securityName={FIELD_NAMES.securityCode}
        errors={errors}
        onChangeNumber={setFieldValue}
        onChangeMonth={handleChange}
        onChangeYear={handleChange}
        onChangeSecurity={handleChange}
        isCenter={true}
      />
      {
        (errorLength || '') &&
        <p>{errorLength}件エラーがあります。</p>
      }
     
      <Center>
        <Button
          type="submit"
          content="Charge"
          active
        />
      </Center>
    </form>
  );
};
export default withFormik({
  mapPropsToValues: () => {
    const obj = {};
    Object.keys(FIELD_NAMES).forEach((keyName) => {
      const key = FIELD_NAMES[keyName];
      obj[key] = '';
    });

    return obj;
  },
  handleSubmit: (values, { props, setFieldError, setErrors }) => {
    const params = {
      cardno: values[FIELD_NAMES.cardNumber],
      expire: `20${values[FIELD_NAMES.expireYear]}${values[FIELD_NAMES.expireMonth]}`,
      securitycode: values.security_code,
    };
    let tokenGmo = '';
    function getTokenCallback(res) {
      let isNG = false;

      if (res.tokenObject) {
        tokenGmo = res.tokenObject.token;
      }
      setErrors({});
      VALIDATIONS.forEach((prop) => {
        const value = values[prop.key];
        if (!value) {
          setFieldError(prop.key, prop.error);
          isNG = true;
        }
      });
      if (isNG) return false;
      values.token = tokenGmo;
      props.charge(values);
    }
    const funcName = getTokenCallback.name;
    window[funcName] = getTokenCallback;
    Multipayment.init(SHOP_CONFIG.id);
    Multipayment.getToken(params, getTokenCallback);
  }
})(GmoPaymentForm);