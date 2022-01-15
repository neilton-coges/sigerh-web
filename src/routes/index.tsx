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
import { ListNivelCargo } from '../pages/NiveisCargos/List';
import { CreateNivelCargo } from '../pages/NiveisCargos/Create';
import { EditNivelCargo } from '../pages/NiveisCargos/Edit';
import { CreateClasseNivelCargo } from '../pages/NiveisCargos/ClassesNiveisCargos/Create';
import { EditClasseNivelCargo } from '../pages/NiveisCargos/ClassesNiveisCargos/Edit';
import { CreatePadraoClasseNivelCargo } from '../pages/NiveisCargos/ClassesNiveisCargos/PadroesClassesNiveisCargos/Create';
import { EditPadraoClasseNivelCargo } from '../pages/NiveisCargos/ClassesNiveisCargos/PadroesClassesNiveisCargos/Edit';
import { CreateReajusteClasseNivelCargo } from '../pages/NiveisCargos/ClassesNiveisCargos/ReajustesClassesNiveisCargos/Create';

export function Routes() {
  return (
    <BrowserRouter>
      <RoutesDOM>
        <Route path="/login" element={<SignIn />} />
        <Route path="/" element={<PrivateRoute component={Dashboard} />} />

        <Route path="/cds" element={<PrivateRoute component={ListCdsFg} />} />
        <Route path="/cds/create" element={<PrivateRoute component={CreateCdsFg} />} />
        <Route path="/cds/:id" element={<PrivateRoute component={EditCdsFG} />} />

        <Route path="/niveis_cargos" element={<PrivateRoute component={ListNivelCargo} />} />
        <Route path="/niveis_cargos/create" element={<PrivateRoute component={CreateNivelCargo} />} />
        <Route path="/niveis_cargos/:nivelCargoId" element={<PrivateRoute component={EditNivelCargo} />} />

        <Route
          path="/niveis_cargos/:nivelCargoId/classes/create"
          element={<PrivateRoute component={CreateClasseNivelCargo} />}
        />
        <Route
          path="/niveis_cargos/:nivelCargoId/classes/:classeNivelCargoId"
          element={<PrivateRoute component={EditClasseNivelCargo} />}
        />

        <Route
          path="/niveis_cargos/:nivelCargoId/classes/:classeNivelCargoId/padroes/create"
          element={<PrivateRoute component={CreatePadraoClasseNivelCargo} />}
        />
        <Route
          path="/niveis_cargos/:nivelCargoId/classes/:classeNivelCargoId/padroes/:padraoClasseNivelCargoId"
          element={<PrivateRoute component={EditPadraoClasseNivelCargo} />}
        />

        <Route
          path="/niveis_cargos/:nivelCargoId/classes/:classeNivelCargoId/reajustes/create"
          element={<PrivateRoute component={CreateReajusteClasseNivelCargo} />}
        />
      </RoutesDOM>
    </BrowserRouter>
  );
}
