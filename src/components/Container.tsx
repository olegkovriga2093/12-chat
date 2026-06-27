import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'

export const Container = ({ children }) => {
	const client = new QueryClient()
	return (
		<div>
			<QueryClientProvider client={client}>
				<BrowserRouter>{children}</BrowserRouter>
			</QueryClientProvider>
		</div>
	)
}
