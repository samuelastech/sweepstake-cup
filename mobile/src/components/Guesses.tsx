import { FlatList, useToast } from 'native-base';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { createToast } from '../utils';
import { Game, GameProps } from './Game';

interface Props {
	sweepstackId: string;
}

export function Guesses({ sweepstackId }: Props) {
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

	useEffect(() => {
		fetchGames()
	}, [sweepstackId])

	return (
		<FlatList
			data={games}
			keyExtractor={item => item.id}
			renderItem={({ item }) => (
				<Game
					data={item}
					setFirstTeamPoints={setFirstTeamPoints}
					setSecondTeamPoints={setSecondTeamPoints}
					onGuessConfirm={() => {}}
				/>
			)}
		/>
	);
}
