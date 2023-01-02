import { NavigationContainer } from '@react-navigation/native'
import { useAuth } from '../hooks/useAuth'

import SignIn from '../screens/SignIn'

import AppRoutes from './app.route'

export default function Routes(){
    const { user } = useAuth()

    return (
        <NavigationContainer>
            { user.name ? <AppRoutes /> : <SignIn /> }
        </NavigationContainer>
    )
}