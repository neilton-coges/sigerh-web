import {
  BrowserRouter,
  Route,
  Routes as RoutesDOM,
} from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';

import { SignIn } from '../pages/SignIn';
import { PrivateRoute } from './PrivateRoute';

export function Routes() {
  return (
    <BrowserRouter>
      <RoutesDOM>
        <Route path="/login" element={<SignIn />} />
        <Route path="/dash" element={<PrivateRoute component={Dashboard} />} />
      </RoutesDOM>
    </BrowserRouter>
  );
}
