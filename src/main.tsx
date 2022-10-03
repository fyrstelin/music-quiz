import ReactDOM from 'react-dom/client'
import { App } from './App'
import { setupIonicReact } from '@ionic/react'
import './index.css'
import './theme.css'
import '@ionic/react/css/core.css';

setupIonicReact()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
