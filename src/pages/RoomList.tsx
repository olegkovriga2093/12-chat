import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { useChatStore, type Room } from '../store/chatStore'
import { supabase } from '../supabaseClient'

const fetchRooms = async (): Promise<Room[]> => {
	const { data, error } = await supabase
		.from('rooms')
		.select('*')
		.order('created_at', { ascending: true })

	if (error) throw Error(error.message)
	return data as Room[]
}

export const RoomList = () => {
	const {
		data: rooms,
		error,
		isLoading
	} = useQuery({ queryKey: ['rooms'], queryFn: fetchRooms })

	const handleJoinRoom = (room: Room) => {
		useChatStore.getState().setCurrentRoom(room)
	}

	if (isLoading) return <p>Loading rooms...</p>
	if (error) return <p>Error loading rooms: {error.message}</p>
	return (
		<div>
			<h2>Available Rooms</h2>

			<ul>
				{rooms?.map((room: Room, key) => {
					return (
						<li key={key}>
							<Link
								to='/'
								onClick={() => handleJoinRoom(room)}
							>
								{room.name}
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
