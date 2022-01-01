import 'antd/dist/antd.min.css';

import { GlobalStyle } from './styles/global';
import { AuthLayout } from './pages/_layout/AuthLayout';
import { SignIn } from './pages/SignIn';

function App() {
  return (
    <>
      <AuthLayout>
        <SignIn />
      </AuthLayout>
      <GlobalStyle />
    </>
  );
}

export default App;
