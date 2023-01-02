import { NavigationContainer } from '@react-navigation/native'
import AppRoutes from './app.route'

export default function Routes(){
    return (
        <NavigationContainer>
            <AppRoutes />
        </NavigationContainer>
    )
}