import { NavigationContainer } from '@react-navigation/native'

import SignIn from '../screens/SignIn'

import AppRoutes from './app.route'

export default function Routes(){
    return (
        <NavigationContainer>
            <SignIn />
        </NavigationContainer>
    )
}