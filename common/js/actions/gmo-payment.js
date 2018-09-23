import {
  CHARGE,
  REFUND,
} from '@constants/index';
import api from '@lib/api';
import generateActionCreator from '@lib/generateActionCreator';

export const chargeAction = generateActionCreator(CHARGE, 'orderId');
export const refundAction = generateActionCreator(REFUND, 'id');

export const charge = (params) => {
  return dispatch => {
    return api
      .post('/api/gmo-payment/charge', { params })
      .then(orderId => {
        dispatch(chargeAction(orderId));

        return Promise.resolve(orderId);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  };
};

export const refund = (params) => {
  return dispatch => {
    return api
      .post('/api/gmo-payment/refund', { params })
      .then(orderId => {
        dispatch(refundAction(orderId));

        return Promise.resolve(orderId);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  };
};
