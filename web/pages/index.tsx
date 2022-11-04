interface HomeProps {
	pools: number;
}

export default function Home(props: HomeProps) {
	return (
		<h1>Count: { props.pools }</h1>
	)
}

/**
 * Not getting response from Server
 */
export const getServerSideProps = async () => {
	const response = await fetch('http://localhost:3333/pools/count')
	const data = await response.json()

	console.log(data)

	return {
		props: {
			pools: data.pools 
		}
	}
}
