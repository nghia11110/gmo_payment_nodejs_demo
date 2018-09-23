import React from 'react';
import PropTypes from 'prop-types';
import { List, Button } from 'semantic-ui-react';
import classnames from 'classnames/bind';
import css from './index.scss';

const cx = classnames.bind(css);

const GmoPaymentItem = props => {
  const { onRefund, gmoPayment: { id, completed, text } } = props;

  return (
    <List.Item className={classnames(css.GmoPayment, css.extra)}>
      <List.Content floated="right">
        <Button onClick={() => onRefund(id)} icon="remove" size="mini" />
      </List.Content>
      <List.Content className={cx(css.text, { [css.completed]: completed })}>
        {text}
      </List.Content>
    </List.Item>
  );
};

GmoPaymentItem.propTypes = {
  gmoPayment: PropTypes.object.isRequired,
  onRefund: PropTypes.func,
};

GmoPaymentItem.defaultProps = {
  onRefund: () => {},
};

export default GmoPaymentItem;
