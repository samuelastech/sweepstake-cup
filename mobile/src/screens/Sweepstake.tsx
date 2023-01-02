import { VStack, Icon, FlatList } from 'native-base';
import { useEffect, useState } from 'react';
import { Octicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import { Header } from '../components/Header';
import Button from '../components/Button';
import { PoolCard, PoolPros } from '../components/SweepstakeCard';
import Loading from '../components/Loading';
import { EmptyPoolList } from '../components/EmptySweepstakeList';

import { api } from '../services/api';
import { useToast } from 'native-base'
import { createToast } from '../utils'

export default function Sweepstake() {
    const [isLoading, setIsLoading] = useState(true)
    const [sweepstakes, setSweepstakes] = useState([] as PoolPros[])
    const { navigate } = useNavigation()
    const toast = useToast()

    async function fetchSweepstakes(){
        try {
            setIsLoading(true)
            const response = await api.get('/sweepstakes')
            setSweepstakes(response.data.sweepstakes)
        } catch (error) {
            createToast(toast, 'Não foi possível carregar os bolões')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSweepstakes()
    }, [])

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header title='Meus bolões' />

            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor='gray.600' pb={4} mb={4}>
                <Button
                    title='Buscar bolão por código'
                    leftIcon={<Icon as={Octicons} name='search' color='black' size='md' />}
                    onPress={() => navigate('find')}
                />
            </VStack>

            {
                isLoading ? <Loading /> :
                    <FlatList
                        data={sweepstakes}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <PoolCard data={item} />}
                        px={5}
                        showsVerticalScrollIndicator={false}
                        _contentContainerStyle={{ pb: 10 }}
                        ListEmptyComponent={() => <EmptyPoolList />}
                    />
            }
        </VStack>
    )
}