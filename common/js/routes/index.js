import Error from '@pages/Error';
import Home from '@pages/Home';
import Todos from '@pages/Todos';
import GmoPayment from '@pages/GmoPayment';

export default [
  { path: '/', exact: true, component: Home },
  { path: '/todos', exact: true, component: Todos },
  { path: '/gmo_payment', exact: true, component: GmoPayment },
  { path: '*', component: Error }
];
