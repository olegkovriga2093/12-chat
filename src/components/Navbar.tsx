import { Link, Route, Routes } from 'react-router'
import { ChatRoom, CreateRoom, RoomList } from '../pages'
import { supabase } from '../supabaseClient'

export const PAGES = { HOME: '/', ROOMS: '/rooms', CREATE_ROOM: '/create-room' }

export const Navbar = () => {
	const handleLogout = async () => {
		await supabase.auth.signOut()
	}
	return (
		<nav>
			<ul>
				<li>
					<Link to={PAGES.HOME}>Chat Room</Link>
				</li>
				<li>
					<Link to={PAGES.ROOMS}>Available Rooms</Link>
				</li>
				<li>
					<Link to={PAGES.CREATE_ROOM}>Create Room</Link>
				</li>
			</ul>
			<button onClick={handleLogout}>Logout</button>
			<Routes>
				<Route
					path={PAGES.HOME}
					element={<ChatRoom />}
				/>
				<Route
					path={PAGES.ROOMS}
					element={<RoomList />}
				/>
				<Route
					path={PAGES.CREATE_ROOM}
					element={<CreateRoom />}
				/>
			</Routes>
		</nav>
	)
}
