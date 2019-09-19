import { createStackNavigator } from 'react-navigation';
import HubShowScreen from '../screens/HubShowScreen'


const MainScreenStack = createStackNavigator({ 
    HubShow: HubShowScreen, 
});

export default MainScreenStack;