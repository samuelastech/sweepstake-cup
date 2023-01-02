import { Heading, useToast, VStack } from 'native-base';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import Button from '../components/Button';

import { useState } from 'react';
import { createToast } from '../utils';
import { api } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function Find() {
    const [isLoading, setIsLoading] = useState(false)
    const [code, setCode] = useState('')
    const { navigate } = useNavigation()
    const toast = useToast()

    async function handleJoinSweepstake() {
        try {
            setIsLoading(true)

            if(!code.trim()){
                return createToast(toast, 'Informe o código')
            }

            await api.post('/sweepstakes/join', { code })
            navigate('sweepstakes')
            createToast(toast, 'Você entrou no bolão com sucesso', false)
        } catch (error) {
            setIsLoading(false)
            console.log(error)

            switch (error.response?.data?.message) {
                case 'Pool not found':
                    return createToast(toast, 'Bolão não encotrado')

                case 'You already joined this sweepstake':
                    return createToast(toast, 'Você já está nesse bolão')
                
                default:
                    break;
            }

            createToast(toast, 'Não foi possível encontrar o bolão')
        }
    }

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header title='Buscar por código' showBackButton />
            <VStack mt={8} mx={5} alignItems='center'>
                <Heading fontFamily='heading' color='white' fontSize='xl' mb={8} textAlign='center'>
                    Encontre um bolão através de {'\n'} seu código único
                </Heading>

                <Input
                    mb={2}
                    placeholder='Qual o código do bolão?'
                    onChangeText={setCode}
                    value={code}
                    autoCapitalize='characters'
                />

                <Button
                    title='Buscar bolão'
                    isLoading={isLoading}
                    onPress={handleJoinSweepstake}
                />
            </VStack>
        </VStack>
    )
}