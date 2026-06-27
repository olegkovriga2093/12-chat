import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { Container } from './components'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Container>
			<App />
		</Container>
	</StrictMode>
)
