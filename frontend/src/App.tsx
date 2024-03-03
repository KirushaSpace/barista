import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthContext } from './AuthContext'
import { useSessionStorage } from './hooks/useSessionStorage'
import { Layout } from './components/Layout'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'

const queryClient = new QueryClient({defaultOptions: {queries: {refetchOnWindowFocus: false}}})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={useSessionStorage('token', '')}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout/>}>
              <Route path='/signIn' element={<SignInPage/>}/>
              <Route path='/signUp' element={<SignUpPage/>}/>
              <Route index element={<>courses</>}/>
              <Route path=':courseId' element={<>course</>}>
                <Route index element={<>modules</>}/>
                <Route path=':moduleId' element={<>module</>}/>
              </Route>
              <Route path='/profile' element={<>profile</>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  )
}

export default App
