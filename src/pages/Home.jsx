import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../components/Navbar'
import NowShowing from '../components/NowShowing'
import TheaterListsByMovie from '../components/TheaterListsByMovie'
import { AuthContext } from '../context/AuthContext'
import { useParams } from 'react-router-dom'

const Home = () => {
	const { auth } = useContext(AuthContext)
	const [selectedMovieIndex, setSelectedMovieIndex] = useState(parseInt(sessionStorage.getItem('selectedMovieIndex')))
	const [movies, setMovies] = useState([])
	const [isFetchingMoviesDone, setIsFetchingMoviesDone] = useState(false)
	const { id } = useParams();



	const fetchMovies = async (data) => {
		try {
			setIsFetchingMoviesDone(false)
			let response
			if (auth.role === 'admin') {
				response = await axios.get('/movie/unreleased/showing', {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
			} else {
				response = await axios.get('/movie/showing')
			}

			setMovies(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingMoviesDone(true)
		}
	}

	useEffect(() => {
		fetchMovies()
	}, [])

	useEffect(() => {
		if (id) {
			setSelectedMovieIndex(id)
		}
	}, [])

	const props = {
		movies,
		selectedMovieIndex,
		setSelectedMovieIndex,
		auth,
		isFetchingMoviesDone
	}
	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 sm:gap-8">
			<Navbar />
			<NowShowing {...props} />
			{movies.find((movie) => (movie._id === selectedMovieIndex))?.name && <TheaterListsByMovie {...props} />}
		</div>
	)
}

export default Home
