interface HomeProps {
	poolCount: number;
	guessCount: number;
	userCount: number;
}

import Image from 'next/image'

/**
 * Assets
 */
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import iconCheckImg from '../assets/icon-check.svg'
import logoImg from '../assets/logo.svg'

import { api } from '../lib/axios'

export default function Home(props: HomeProps) {
	return (
		<div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
			<main>
				<Image src={logoImg} alt='NLW Copa' quality={100}/>

				<h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
					Crie seu próprio bolão da copa e compartilhe entre amigos!
				</h1>

				<div className='mt-10 flex items-center gap-2'>
					<Image src={usersAvatarExampleImg} alt='' quality={100}/>
					<strong className='text-gray-100 text-xl'>
						<span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão usando
					</strong>
				</div>

				<form className='mt-10 flex gap-2'>

					<input 
						className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm'
						placeholder='Qual nome do seu bolão?'
						type="text"
						required
					/>

					<button
						type='submit'
						className='
							bg-yellow-500
							hover:bg-yellow-700
							text-gray-900
							text-sm
							rounded 
							px-6 py-4
							font-bold  uppercase'
						>Criar meu bolão
					</button>
				</form>

				<p className='text-gray-300 mt-4 text-sm leading-relaxed'>
					Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
				</p>

				<div className='mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100'>
					<div className='flex items-center gap-6'>
						<Image src={iconCheckImg} alt='Check' />
						<div className='flex flex-col'>
							<span className='font-bold text-2xl'>+{props.poolCount}</span>
							<span>Bolões criados</span>
						</div>
					</div>

					<div className='w-px h-14 bg-gray-600' />

					<div className='flex items-center gap-6'>
						<Image src={iconCheckImg} alt='Check' />
						<div className='flex flex-col'>
							<span className='font-bold text-2xl'>+{props.guessCount}</span>
							<span>Palpites enviados</span>
						</div>
					</div>
				</div>
			</main>
			<Image src={appPreviewImg} alt='Mockup' quality={100}/>
		</div>
	)
}

/**
 * Not getting response from Server
 */
export const getServerSideProps = async () => {
	const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
		api.get('pools/count'),
		api.get('guesses/count'),
		api.get('users/count')
	])

	return {
		props: {
			poolCount: poolCountResponse.data.pools,
			guessCount: guessCountResponse.data.guesses,
			userCount: userCountResponse.data.users,
		}
	}
}
