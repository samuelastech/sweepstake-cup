import { Heading, Text, useToast, VStack } from 'native-base';
import { useState } from 'react'

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import Button from '../components/Button';

import Logo from '../assets/logo.svg'

import { api } from '../services/api';
import { createToast } from '../utils'

export default function New() {
    const [title, setTitle] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    async function handlePoolCreate(){
        if(!title.trim()){
            return createToast(toast, 'Informe um nome para o seu bolão')
        }
        setIsLoading(true)
        try {
            await api.post('/sweepstakes', { title })
            createToast('Bolão criado com sucesso', false)
            setTitle('')
        } catch (error) {
            console.log(error)
            return createToast('Não foi possível criar o bolão')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header title='Criar novo bolão' />
            <VStack mt={8} mx={5} alignItems='center'>
                <Logo />

                <Heading fontFamily='heading' color='white' fontSize='xl' my={8} textAlign='center'>
                    Crie seu próprio bolão da copa {'\n'} e compartilhe entre amigos!
                </Heading>

                <Input
                    mb={2}
                    placeholder='Qual o nome do seu bolão?'
                    onChangeText={setTitle}
                    value={title}
                />

                <Button
                    title='Criar meu bolão'
                    onPress={handlePoolCreate}
                    isLoading={isLoading}
                />

                <Text color='gray.200' fontSize='sm' textAlign='center' px={10} mt={4}>
                    Após criar seu bolão, você receberá um código único que poderá usar 
                    para convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
    )
}