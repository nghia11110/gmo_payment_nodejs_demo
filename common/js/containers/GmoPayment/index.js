import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  charge,
  refund,
} from '@actions/gmo-payment';
import { Container } from 'semantic-ui-react';
import {
  GmoPaymentForm
} from '@components/gmo-payment';

class GmoPaymentContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  charge = params => {
    const { dispatch } = this.props;

    if (params) {
      dispatch(charge(params));
    }
  };

  refund = params => {
    const { dispatch } = this.props;

    dispatch(refund(params));
  };

  render() {
    const title = 'GMO payment';

    return (
      <Container>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <h1>{title}</h1>
        <GmoPaymentForm
          charge={this.charge}
          refund={this.refund}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  gmoPayments: state.gmoPayments,
  todos: state.todos
});

export default connect(mapStateToProps)(GmoPaymentContainer);
