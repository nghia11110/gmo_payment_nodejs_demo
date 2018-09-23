import React, { Component } from 'react';
// import { fetchTodos } from '@actions/todos';
import GmoPaymentContainer from '@containers/GmoPayment';

class GmoPaymentPage extends Component {
  // static fetchData = ({ store }) => {
  //   return store.dispatch(fetchTodos());
  // };

  render() {
    return <GmoPaymentContainer />;
  }
}

export default GmoPaymentPage;
