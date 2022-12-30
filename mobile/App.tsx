/**
 * Screens
 */
import Sweepstake from './src/screens/Sweepstake'

/**
 * Components
 */
import Loading from './src/components/Loading'

/**
 * Customized theme
 */
import { THEME } from './src/styles/theme'
import { NativeBaseProvider, StatusBar } from 'native-base'

import { AuthContextProvider } from './src/context/AuthContext'

/**
 * App fonts
 */
import {
	useFonts,
	Roboto_400Regular,
	Roboto_500Medium,
	Roboto_700Bold
} from '@expo-google-fonts/roboto'

export default function App() {
	const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold })

	return (
		<NativeBaseProvider theme={THEME}>
			<AuthContextProvider>
				<StatusBar
					barStyle='light-content'
					backgroundColor='transparent'
					translucent
				/>
				{ fontsLoaded ? <Sweepstake /> : <Loading /> }
			</AuthContextProvider>
		</NativeBaseProvider>
	);
}