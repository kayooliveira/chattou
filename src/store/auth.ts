import { faker } from '@faker-js/faker'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import { produce } from 'immer'
import { auth, database } from 'lib/firebase'
import toast from 'react-hot-toast'
import create from 'zustand'

export interface User {
  id: string
  name: string
  profilePic?: string
  username: string
}

interface State {
  user: User
  isAuth: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User) => void
  isAuthLoading: boolean
}

function storeUser(user: User) {
  localStorage.setItem('uid', user.id)
  localStorage.setItem('name', user.name)
  localStorage.setItem('profilePic', user.profilePic || '')
  localStorage.setItem('username', user.username)
}

function clearUser() {
  localStorage.removeItem('uid')
  localStorage.removeItem('name')
  localStorage.removeItem('profilePic')
  localStorage.removeItem('username')
}

const userInitialState: User = {
  id: '',
  name: '',
  profilePic: '',
  username: ''
}

export const useAuthStore = create<State>(setState => ({
  user: userInitialState,
  isAuthLoading: false,
  isAuth: false,
  signIn: async () => {
    try {
      setState(state => ({ ...state, isAuthLoading: true }))
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)
      const { uid: id, displayName: name, photoURL: profilePic, email } = user
      if (name && email) {
        const userFirstname = name.split(' ')[0]
        const userLastName = name.split(' ')[1]
        const newUser = {
          id,
          name,
          email,
          profilePic: profilePic || '',
          username: faker.internet.userName(userFirstname, userLastName),
          chats: []
        }

        storeUser(newUser)
        const usersRef = collection(database, 'users')

        await setDoc(doc(usersRef, newUser.id), {
          name,
          profilePic,
          username: newUser.username
        })

        setState(
          produce<State>(state => {
            state.user = newUser
            state.isAuth = true
            state.isAuthLoading = false
          })
        )
      }
      setState(state => ({ ...state, isLoading: false }))
    } catch (error) {
      toast.error('Ocorreu um erro ao fazer login')
      console.error('signInError', error)
    }
  },
  signOut: async () => {
    try {
      setState(state => ({ ...state, isAuthLoading: true }))
      await auth.signOut()
      clearUser()
      setState(
        produce<State>(state => {
          state.user = userInitialState
          state.isAuth = false
          state.isAuthLoading = false
        })
      )
    } catch (error) {
      toast.error('Ocorreu um erro ao fazer logout')
      console.error('signOutError', error)
    }
  },
  setUser: (user: User) => {
    try {
      setState(
        produce<State>(state => {
          state.user = user
          state.isAuth = true
          state.isAuthLoading = false
        })
      )
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar os dados do usuário')
      console.error('setUserError', error)
    }
  }
}))
