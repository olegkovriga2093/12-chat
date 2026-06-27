import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'

interface ContainerProps {
	children: ReactNode
}

export const Container = ({ children }: ContainerProps) => {
	const client = new QueryClient()
	return (
		<div>
			<QueryClientProvider client={client}>
				<BrowserRouter>{children}</BrowserRouter>
			</QueryClientProvider>
		</div>
	)
}
