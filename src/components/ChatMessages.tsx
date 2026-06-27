import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useChatStore } from '../store/chatStore'
import { supabase } from '../supabaseClient'

interface Message {
	id: number
	content: string
	user_id: string
	email: string
	created_at: string
	room_id: number
}

const fetchMessages = async (roomId: number): Promise<Message[]> => {
	const { data, error } = await supabase
		.from('messages')
		.select('*')
		.eq('room_id', roomId)
		.order('created_at', { ascending: true })

	if (error) throw Error(error.message)

	return data as Message[]
}

export const ChatMessages = () => {
	const { currentRoom, user } = useChatStore()
	const queryClient = useQueryClient()
	const {
		data: messages,
		error,
		isLoading
	} = useQuery<Message[], Error>({
		queryKey: ['messages', currentRoom?.id],
		queryFn: () =>
			currentRoom?.id === null
				? Promise.resolve([])
				: fetchMessages(currentRoom!.id),
		enabled: currentRoom?.id !== null
	})

	useEffect(() => {
		if (!currentRoom?.id) return

		const channel = supabase.channel('messages-channel')

		channel
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'messages'
				},
				payload => {
					const newMessage = payload.new as Message
					if (newMessage.room_id === currentRoom.id) {
						queryClient.setQueryData<Message[]>(
							['messages', currentRoom?.id],
							oldMessages =>
								oldMessages ? [...oldMessages, newMessage] : [newMessage]
						)
					}
				}
			)
			.subscribe(status => console.log('Sub status: ', status))

		return () => {
			supabase.removeChannel(channel)
		}
	}, [currentRoom?.id])

	if (isLoading) return <p>Loading messages...</p>
	if (error) return <p>Error loading messages: {error.message}</p>

	return (
		<>
			{messages?.map((message: Message, key) => {
				const isOwnMessage = message.user_id === user?.id

				const date = new Date(message.created_at)
				const hour = date.getHours().toString().padStart(2, '0')
				const minute = date.getMinutes().toString().padStart(2, '0')
				const formattedTime = `${hour}:${minute}`
				return (
					<div
						key={key}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: isOwnMessage ? 'end' : 'start'
						}}
					>
						<div>{message.content}</div>
						<div>
							<div>{formattedTime}</div>
							<div>{message.email}</div>
						</div>
					</div>
				)
			})}
		</>
	)
}
