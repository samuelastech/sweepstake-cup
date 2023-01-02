import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform } from 'react-native'
import { PlusCircle, SoccerBall } from 'phosphor-react-native'
import { useTheme } from 'native-base'

import New from '../screens/New'
import Sweepstake from '../screens/Sweepstake'
import Find from '../screens/Find'

const { Navigator, Screen } = createBottomTabNavigator()

export default function AppRoutes(){
    const { colors, sizes } = useTheme()
    const size = sizes[6]

    return(
        <Navigator screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.yellow[500],
            tabBarInactiveTintColor: colors.gray[300],
            tabBarLabelPosition: 'beside-icon',
            tabBarItemStyle: {
                position: 'relative',
                top: Platform.OS === 'android' ? -10 : 0
            },
            tabBarStyle: {
                position: 'absolute',
                height: sizes[22],
                borderTopWidth: 0,
                backgroundColor: colors.gray[800]
            },
        }}>
            <Screen
                name='new'
                component={New}
                options={{
                    tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />,
                    tabBarLabel: 'Novo bolão'
                }}
            />

            <Screen
                name='sweepstakes'
                component={Sweepstake}
                options={{
                    tabBarIcon: ({ color }) => <SoccerBall color={color} size={size} />,
                    tabBarLabel: 'Meus bolões'
                }}
            />

            <Screen
                name='find'
                component={Find}
                options={{ tabBarButton: () => null }}
            />
        </Navigator>
    )
}