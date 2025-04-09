import Home from './components/pages/home/home'
import Screen from './components/layout/scene'
import { Routes, Route } from 'react-router-dom';
import Manual from './components/utils/manual';
import { Suspense, useState } from 'react';
import Entrace from './components/utils/entrace';
import { useSelector } from 'react-redux';
import { IRootState } from './redux';

function App() {
  const [manualView, setManualView] = useState<boolean>(true);
  const [introView, setIntroView] = useState<boolean>(true);

  const screenVisible = useSelector((state: IRootState) => state.arcade[0].screenVisible);

  // Desabilitar menus do navegador
  document.addEventListener('dblclick', function (event) {
    event.preventDefault();
    return false;
  }, false);
  document.addEventListener('selectstart', function (event) {
    event.preventDefault();
    return false;
  }, false);
  document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    return false;
  }, false);

  return (
    <>
      {manualView && <Manual setView={setManualView} />}
      {screenVisible && introView ?
        <Routes>
          <Route index element={<Screen><Entrace setView={setIntroView} /></Screen>} />
        </Routes> :
        <Routes>
          <Route path="/" element={<Screen><Home /></Screen>}>
          </Route>
        </Routes>
      }
    </>
  );
}

export default App;