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
import { ListCargo } from '../pages/Cargos/List';
import { CreateCargo } from '../pages/Cargos/Create';
import { EditCargo } from '../pages/Cargos/Edit';
import { ListJornada } from '../pages/Jornadas/List';
import { CreateJornada } from '../pages/Jornadas/Create';
import { EditJornada } from '../pages/Jornadas/Edit';
import { ListUnidade } from '../pages/Unidades/List';
import { CreateUnidade } from '../pages/Unidades/Create';
import { EditUnidade } from '../pages/Unidades/Edit';
import { ListServidor } from '../pages/Servidores/List';
import { CreateServidor } from '../pages/Servidores/Create';
import { EditServidor } from '../pages/Servidores/Edit';
import { ListUsuario } from '../pages/Usuarios/List';
import { CreateUsuario } from '../pages/Usuarios/Create';
import { EditUsuario } from '../pages/Usuarios/Edit';
import { ListNomeacao } from '../pages/Nomeacoes/List';
import { CreateNomeacao } from '../pages/Nomeacoes/Create';
import { EditNomeacao } from '../pages/Nomeacoes/Edit';
import { ListProgressao } from '../pages/Progressoes/List';
import { CreateProgressao } from '../pages/Progressoes/Create';
import { EditProgressao } from '../pages/Progressoes/Edit';

export function Routes() {
  return (
    <BrowserRouter>
      <RoutesDOM>
        <Route path="/login" element={<SignIn />} />
        <Route path="/" element={<PrivateRoute component={Dashboard} />} />

        <Route
          path="/cds"
          element={<PrivateRoute component={ListCdsFg} />}
        />
        <Route
          path="/cds/create"
          element={<PrivateRoute component={CreateCdsFg} />}
        />
        <Route
          path="/cds/:id"
          element={<PrivateRoute component={EditCdsFG} />}
        />

        <Route
          path="/niveis_cargos"
          element={<PrivateRoute component={ListNivelCargo} />}
        />
        <Route
          path="/niveis_cargos/create"
          element={<PrivateRoute component={CreateNivelCargo} />}
        />
        <Route
          path="/niveis_cargos/:nivelCargoId"
          element={<PrivateRoute component={EditNivelCargo} />}
        />

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

        <Route
          path="/cargos"
          element={<PrivateRoute component={ListCargo} />}
        />
        <Route
          path="/cargos/create"
          element={<PrivateRoute component={CreateCargo} />}
        />
        <Route
          path="/cargos/:cargoId"
          element={<PrivateRoute component={EditCargo} />}
        />

        <Route
          path="/jornadas"
          element={<PrivateRoute component={ListJornada} />}
        />
        <Route
          path="/jornadas/create"
          element={<PrivateRoute component={CreateJornada} />}
        />
        <Route
          path="/jornadas/:jornadaId"
          element={<PrivateRoute component={EditJornada} />}
        />

        <Route
          path="/unidades"
          element={<PrivateRoute component={ListUnidade} />}
        />

        <Route
          path="/unidades/create"
          element={<PrivateRoute component={CreateUnidade} />}
        />

        <Route
          path="/unidades/:unidadeId"
          element={<PrivateRoute component={EditUnidade} />}
        />

        <Route
          path="/servidores"
          element={<PrivateRoute component={ListServidor} />}
        />

        <Route
          path="/servidores/create"
          element={<PrivateRoute component={CreateServidor} />}
        />

        <Route
          path="/servidores/:servidorId"
          element={<PrivateRoute component={EditServidor} />}
        />

        <Route
          path="/usuarios"
          element={<PrivateRoute component={ListUsuario} />}
        />
        <Route
          path="/usuarios/create"
          element={<PrivateRoute component={CreateUsuario} />}
        />
        <Route
          path="/usuarios/:usuarioId"
          element={<PrivateRoute component={EditUsuario} />}
        />

        <Route
          path="/nomeacoes"
          element={<PrivateRoute component={ListNomeacao} />}
        />

        <Route
          path="/nomeacoes/create"
          element={<PrivateRoute component={CreateNomeacao} />}
        />

        <Route
          path="/nomeacoes/:nomeacaoId"
          element={<PrivateRoute component={EditNomeacao} />}
        />

        <Route
          path="/progressoes"
          element={<PrivateRoute component={ListProgressao} />}
        />

        <Route
          path="/progressoes/create"
          element={<PrivateRoute component={CreateProgressao} />}
        />

        <Route
          path="/progressoes/:progressaoId"
          element={<PrivateRoute component={EditProgressao} />}
        />
      </RoutesDOM>
    </BrowserRouter>
  );
}
