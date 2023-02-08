import { faker } from '@faker-js/faker'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { ref, get, child, set } from 'firebase/database'
import { produce } from 'immer'
import { auth, database } from 'lib/firebase'
import toast from 'react-hot-toast'
import create from 'zustand'

interface User {
  id: string
  name: string
  email: string
  profilePic?: string
  contacts?: string[]
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
  localStorage.setItem('contacts', JSON.stringify(user.contacts))
  localStorage.setItem('username', user.username)
}

function clearUser() {
  localStorage.removeItem('uid')
  localStorage.removeItem('name')
  localStorage.removeItem('profilePic')
  localStorage.removeItem('contacts')
  localStorage.removeItem('username')
}

const userInitialState: User = {
  id: '',
  name: '',
  email: '',
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
        const refContacts = ref(database)
        const contacts = await get(child(refContacts, 'contacts/' + id))
          .then(snapshot => {
            if (snapshot.exists()) {
              return snapshot.val()
            } else {
              toast.error('Você não possui contatos.')
            }
          })
          .catch(error => {
            toast.error('Ocorreu um erro ao buscar seus contatos')
            console.error(error)
          })
        console.log('contatos', contacts)
        const userFirstname = name.split(' ')[0]
        const userLastName = name.split(' ')[1]
        const newUser = {
          id,
          name,
          email,
          profilePic: profilePic || '',
          contacts,
          username: faker.internet.userName(userFirstname, userLastName)
        }

        storeUser(newUser)
        const refUsers = ref(database, 'users/' + id)
        await set(refUsers, {
          id,
          name,
          email,
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
