import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { IoLogoGoogle } from 'react-icons/io'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from 'store/auth'

import logo from '../../assets/img/logo-horizontal.png'

export function Home() {
  const signIn = useAuthStore(state => state.signIn)
  const isAuth = useAuthStore(state => state.isAuth)
  const user = useAuthStore(state => state.user)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isAuth) {
      navigate('/chat')
      toast.remove()
      toast.success('Bem vindo de volta, ' + user.name + '!')
    }
  }, [isAuth])

  useEffect(() => {
    if (location.state?.notify) {
      toast.loading(location.state.notify, { duration: 1000 })
    }
  }, [location.state])

  async function handleLogin() {
    await signIn()
    navigate('/chat')
  }

  return (
    <div className="items start flex h-screen w-screen flex-col items-center justify-between bg-home bg-cover bg-no-repeat font-brand text-app-text">
      <div className="flex w-full flex-col items-center justify-center pt-64 text-center">
        <h1 className="text-[4rem] leading-none xl:text-[6rem]">Welcome to</h1>
        <img
          src={logo}
          alt=""
          className="w-[20rem] leading-none xl:w-[35.7rem]"
        />
        <p className="text-center text-2xl leading-snug xl:text-3xl">
          Discover a whole new world of connection with CHATTOU!
          <br /> Chat with people from all over the world in real time,
          <br /> make new friends and share your ideas and experiences.
          <br /> Join our global community right now.
        </p>
      </div>
      <footer className="flex w-full items-center justify-end p-4 pr-16">
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-4 rounded-md bg-red-600 p-4 px-10 text-xl font-bold uppercase leading-none transition-colors hover:bg-red-800"
          >
            <IoLogoGoogle />
            Login
          </button>
          <span>or</span>
          <br />
          <a className="underline transition-colors hover:cursor-pointer hover:text-app-primary">
            log in as anonymous
          </a>
        </div>
      </footer>
    </div>
  )
}
