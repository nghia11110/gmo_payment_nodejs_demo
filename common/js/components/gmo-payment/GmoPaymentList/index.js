import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { GmoPaymentItem } from '@components/gmo-payment';
import classnames from 'classnames';
import css from './index.scss';

const GmoPaymentList = props => {
  const {
    className,
    onRefund,
    gmoPayments,
  } = props;

  return (
    <List divided className={classnames(css.GmoPayment, className)}>
      {gmoPayments.map((gmoPayment, idx) => (
        <GmoPaymentItem
          key={idx}
          gmoPayment={gmoPayment}
          onRefund={onRefund}
        />
      ))}
    </List>
  );
};

GmoPaymentList.propTypes = {
  gmoPayments: PropTypes.object.isRequired,
  className: PropTypes.string,
  onRefund: PropTypes.func,
};

export default GmoPaymentList;
