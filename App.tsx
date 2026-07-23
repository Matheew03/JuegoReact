import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Navegador } from './navigations/MainNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navegador />
    </GestureHandlerRootView>
  );
}
