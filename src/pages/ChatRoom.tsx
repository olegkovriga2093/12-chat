import { ChatMessages, ChatMessagesForm } from '../components'
import { useChatStore } from '../store/chatStore'

export const ChatRoom = () => {
	const { user, currentRoom } = useChatStore()

	if (!currentRoom) {
		return <p>Please join or create a room first.</p>
	}
	return (
		<div>
			<div>
				{currentRoom?.name} - {user?.email}
			</div>

			<div>
				<ChatMessages />
			</div>

			<div>
				<ChatMessagesForm />
			</div>
		</div>
	)
}
