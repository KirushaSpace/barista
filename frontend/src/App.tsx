import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthContext } from './AuthContext'
import { useSessionStorage } from './hooks/useSessionStorage'
import { Layout } from './components/Layout'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { CoursesListPage } from './pages/CoursesListPage'
import { CoursePage } from './pages/CoursePage'
import { ModulePage } from './pages/ModulePage'
import { Profile } from './pages/ProfilePage'

const queryClient = new QueryClient({defaultOptions: {queries: {refetchOnWindowFocus: false}}})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={[useSessionStorage('token', ''), useSessionStorage('username', '')]}>
        <BrowserRouter>
          <Routes>
            <Route path='/signIn' element={<SignInPage/>}/>
            <Route path='/signUp' element={<SignUpPage/>}/>
            <Route path='/' element={<Layout/>}>
              <Route index element={<CoursesListPage/>}/>
              <Route path=':courseId' element={<CoursePage/>}/>
              <Route path=':courseId/:moduleId' element={<ModulePage/>}/>
              <Route path='/profile' element={<Profile/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  )
}

export default App
