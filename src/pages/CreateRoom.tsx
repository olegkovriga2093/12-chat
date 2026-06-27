import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useChatStore } from '../store/chatStore'
import { supabase } from '../supabaseClient'

interface RoomFormData {
	name: string
}

export const CreateRoom = () => {
	const {
		handleSubmit,
		register,
		formState: { errors }
	} = useForm<RoomFormData>()

	const navigate = useNavigate()

	const onSubmit = async (data: RoomFormData) => {
		const { error, data: newRoom } = await supabase
			.from('rooms')
			.insert([
				{
					name: data.name
				}
			])
			.select()

		if (error) {
			console.error('Error creating room: ', error.message)
		} else {
			const room = newRoom[0]
			useChatStore.getState().setCurrentRoom({ id: room.id, name: room.name })
			navigate('/')
		}
	}
	return (
		<div>
			<div>
				<h2>Create a New Room</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div>
						<input
							type='text'
							placeholder='Enter room name...'
							{...register('name', { required: 'Please enter a name.' })}
						/>
						{errors.name && <p>{errors.name.message}</p>}
					</div>
					<button type='submit'>Create Room</button>
				</form>
			</div>
		</div>
	)
}
