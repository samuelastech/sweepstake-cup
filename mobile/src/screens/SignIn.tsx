import { Center, Text } from 'native-base'

import Logo from '../assets/logo.svg'

export default function SignIn(){
    return (
        <Center flex={1} bgColor="gray.900">
           <Logo width={212} height={40} />
        </Center>
    )
}