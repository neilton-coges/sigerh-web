import 'antd/dist/antd.min.css';

import { GlobalStyle } from './styles/global';
import { SignIn } from './pages/SignIn';
import { Routes } from './routes';
import { AppProvider } from './contexts';

function App() {
  return (
    <AppProvider>
      <Routes />
      <GlobalStyle />
    </AppProvider>
  );
}

export default App;
