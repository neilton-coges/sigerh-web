import {
  BrowserRouter,
  Route,
  Routes as RoutesDOM,
} from 'react-router-dom';

import { ListCdsFg } from '../pages/CdsFgs/List';
import { CreateCdsFg } from '../pages/CdsFgs/Create';
import { EditCdsFG } from '../pages/CdsFgs/Edit';
import { Dashboard } from '../pages/Dashboard';
import { SignIn } from '../pages/SignIn';
import { PrivateRoute } from './PrivateRoute';

export function Routes() {
  return (
    <BrowserRouter>
      <RoutesDOM>
        <Route path="/login" element={<SignIn />} />
        <Route path="/" element={<PrivateRoute component={Dashboard} />} />
        <Route path="/cds" element={<PrivateRoute component={ListCdsFg} />} />
        <Route path="/cds/create" element={<PrivateRoute component={CreateCdsFg} />} />
        <Route path="/cds/:id" element={<PrivateRoute component={EditCdsFG} />} />
      </RoutesDOM>
    </BrowserRouter>
  );
}
