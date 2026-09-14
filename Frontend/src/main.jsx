import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from "./api-calls/store.js"
import { ChatProvider } from './components/chat/ChatContext.jsx'



createRoot(document.getElementById('root')).render(

    <Provider store={store}>
      <BrowserRouter>
      <ChatProvider>
          <App />
      </ChatProvider>    
      </BrowserRouter>
    </Provider>
 
)
