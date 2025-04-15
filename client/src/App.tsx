import Home from './components/pages/home'
import Screen from './components/layout/scene'
import Manual from './components/utils/manual';
import { useEffect, useState } from 'react';
import Entrace from './components/utils/entrace';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { IRootState, store } from './redux';
import { setPath, toggleScreenVisibility, toggleVisibility } from './redux/slices/arcadeSlice';
import GamesList from './components/pages/games-list';
import { cn } from './lib/utils';
import { Canvas, GLProps } from '@react-three/fiber';
import * as THREE from 'three';
import TurnOff from './components/utils/turn-off';
import Options from './components/pages/options';

function App() {
  const [manualView, setManualView] = useState<boolean>(true);

  const visible = useSelector((state: IRootState) => state.arcade[0].arcadeVisible);
  const path = useSelector((state: IRootState) => state.arcade[1].path);
  const dispatch = useDispatch();
  const isInDevelopment = import.meta.env.VITE_DEVELOPMENT === 'true';

  useEffect(() => {
    if (isInDevelopment && 0 > 1) {
      setManualView(false);
      dispatch(toggleVisibility(true))
      dispatch(toggleScreenVisibility(true))
      dispatch(setPath('/'));
    }
  }, []);

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

  const getComponent = () => {
    switch (path) {
      case '/entrace':
        return <Entrace />;
      case '/':
        return <Home />;
      case '/quit':
        return <TurnOff />;
      case '/options':
        return <Options />;
      case '/games':
        return <GamesList />;
      default:
        return null;
    }
  }

  return (
    <>
      {manualView && <Manual setView={setManualView} />}
      <div aria-disabled={!visible} className={cn("relative w-full h-screen duration-1200", visible ? "opacity-100" : "opacity-0")}>
        <Canvas className="absolute inset-0 z-0" shadows={{ type: THREE.PCFSoftShadowMap }} gl={{ antialias: true, shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap } } as GLProps}>
          <Screen>
            {
              <Provider store={store}>{getComponent()}</Provider>
            }
          </Screen>
        </Canvas>
      </div>
    </>
  );
}

export default App;