import { FlatList, useToast } from 'native-base';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { createToast } from '../utils';
import { EmptyMyPoolList } from './EmptyMySweepstakeList';
import { Game, GameProps } from './Game';
import Loading from './Loading';

interface Props {
	sweepstackId: string;
	code: string
}

export function Guesses({ sweepstackId, code }: Props) {
	const [isLoading, setIsLoading] = useState(true)
	const [firstTeamPoints, setFirstTeamPoints] = useState('')
	const [secondTeamPoints, setSecondTeamPoints] = useState('')
	const [games, setGames] = useState<GameProps[]>([])
	const toast = useToast()

	async function fetchGames () {
		try {
			setIsLoading(true)
			const response = await api.get(`/sweepstakes/${sweepstackId}/games`)
			setGames(response.data.games)
		} catch (error) {
			console.log(error)
			createToast(toast, 'Não foi possível carregar os jogos')
		} finally {
			setIsLoading(false)
		}
	}

	async function handleGuessConfirm(gameId: string) {
		try {
			if(!firstTeamPoints.trim() || !secondTeamPoints.trim()){
				return createToast(toast, 'Informe os placares')
			}

			await api.post(`/sweepstakes/${sweepstackId}/games/${gameId}/guesses`, {
				firstTeamPoints: Number(firstTeamPoints),
				secondTeamPoints: Number(secondTeamPoints),
			})

			createToast(toast, 'Palpite realizado com sucesso', false)

			fetchGames()
		} catch (error) {
			console.log(error)
			createToast(toast, 'Não foi possível enviar o palpite')
		}
	}

	useEffect(() => {
		fetchGames()
	}, [sweepstackId])

	if(isLoading) return <Loading />

	return (
		<FlatList
			data={games}
			keyExtractor={item => item.id}
			renderItem={({ item }) => (
				<Game
					data={item}
					setFirstTeamPoints={setFirstTeamPoints}
					setSecondTeamPoints={setSecondTeamPoints}
					onGuessConfirm={() => handleGuessConfirm(item.id)}
				/>
			)}
			_contentContainerStyle={{ pb: 10 }}
			ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
		/>
	);
}
