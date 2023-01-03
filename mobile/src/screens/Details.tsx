import { useRoute } from '@react-navigation/native';
import { HStack, useToast, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Share } from 'react-native';

import { Header } from '../components/Header';
import { Guesses } from '../components/Guesses';
import { Option } from '../components/Option';
import { PoolPros } from '../components/SweepstakeCard';
import { PoolHeader } from '../components/SweepstakeHeader';
import Loading from '../components/Loading';

import { api } from '../services/api';
import { createToast } from '../utils';
import { EmptyMyPoolList } from '../components/EmptyMySweepstakeList';

interface RouteParams {
    id: string
}

export default function Details () {
    const route = useRoute()
    const { id } = route.params as RouteParams
    const [isLoading, setIsLoading] = useState(true)
    const [selectedOption, setSelectedOption] = useState<'guesses' | 'ranking'>('guesses')
    const [sweepstakeDetails, setSweepstakeDetails] = useState({} as PoolPros)
    const toast = useToast()

    async function fetchSweepstakeDetails() {
        try {
            setIsLoading(true)
            const response = await api.get(`/sweepstakes/${id}`)
            setSweepstakeDetails(response.data.sweepstakes)
            console.log(response.data.sweepstakes.participants)
        } catch (error) {
            console.log(error)
            createToast(toast, 'Não foi possível carregar os detalhes do bolão')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleCodeShare(){
        await Share.share({
            message: sweepstakeDetails.code
        })
    }

    useEffect(() => {
        fetchSweepstakeDetails()
    }, [id])
    if(isLoading) return <Loading />

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header
                title={sweepstakeDetails.title}
                showBackButton
                showShareButton
                onShare={handleCodeShare}
            />
            {
                sweepstakeDetails._count?.participants > 0 ? 
                    <VStack px={5} flex={1}>
                        <PoolHeader data={sweepstakeDetails} />
                        <HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
                            <Option
                                title='Seus palpites'
                                isSelected={selectedOption === 'guesses'}
                                onPress={() => setSelectedOption('guesses')}
                            />

                            <Option
                                title='Ranking do grupo'
                                isSelected={selectedOption === 'ranking'}
                                onPress={() => setSelectedOption('ranking')}
                            />
                        </HStack>
                        
                        <Guesses sweepstackId={sweepstakeDetails.id} code={sweepstakeDetails.code} />
                    </VStack>
                :
                <VStack px={5} flex={1}>
                    <EmptyMyPoolList code={sweepstakeDetails.code} />
                </VStack>

            }
        </VStack>
    )
}