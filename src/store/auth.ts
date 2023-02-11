import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import { produce } from 'immer'
import { auth, database } from 'lib/firebase'
import toast from 'react-hot-toast'
import { create } from 'zustand'

/**
 * @version 1.0.1 // ! Última refatoração: 11/02/2023
 *
 * @author Kayo Oliveira <contato@kayooliveira.com>
 *
 * @description 'Store' responsável pelo gerenciamento do estado de autenticação da aplicação.
 *
 */

export interface User {
  id: string
  name: string
  username: string
  avatar?: string
}

interface State {
  user: User // ? Usuário ativo no momento.
  isAuth: boolean // ? Define se existe um usuário autenticado.
  isAuthLoading: boolean // ? Define se o usuário está em processo de autenticação.
  signIn: () => Promise<void> // ? Efetua o login do usuário.
  signOut: () => Promise<void> // ? Efetua o logout do usuário.
  setUser: (user: User) => void // ? Define os dados do usuário no estado baseado no parâmetro { user } enviado.
}

const userInitialState: User = {
  // ? Dados iniciais para o estado user.
  id: '',
  name: '',
  username: ''
}

export const useAuthStore = create<State>(setState => ({
  user: userInitialState, // ? Inicia o estado de usuário como "vazio".
  isAuthLoading: false, // ? Inicia o estado de isAuthLoading como false.
  isAuth: false, // ? Inicia o estado de isAuth como false.
  signIn: async () => {
    try {
      setState(state => ({ ...state, isAuthLoading: true })) // ? Seta o estado isAuthLoading para true antes de executar as alterações.

      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider) // ? Responsável por abrir o popup para o usuário efetuar login com o google.

      const { uid: id, displayName: name, photoURL: profilePic } = user // ? Desestruturando a variável que contém os dados do usuário.

      if (name) {
        // ? Verifica se o usuário possui nome.
        const defaultAvatar = `https://api.multiavatar.com/${name.trim()}.svg` // ? Utiliza uma api para geração de um avatar para o usuário caso o mesmo não possua.
        const newUser: User = {
          // ? Cria os dados do novo usuário.
          id,
          name,
          avatar: profilePic || defaultAvatar,
          username: ''
        }

        const usersRef = collection(database, 'users') // ? Referência da collection de usuários no Firebase Firestore.

        await setDoc(doc(usersRef, newUser.id), newUser) // ? Salva os dados do usuário no banco de dados.

        setState(
          // ? Atualiza o estado da aplicação adicionando o novo usuário, atualizando o estado isAuth e isAuthLoading.
          produce<State>(state => {
            state.user = newUser
            state.isAuth = true
            state.isAuthLoading = false
          })
        )
      }

      // ? Caso o usuário não possuir um nome, retorna o valor do estado isAuthLoading para false para evitar o loading infinito na aplicação.
      setState(state => ({ ...state, isLoading: false }))
    } catch (error) {
      toast.error(
        'Erro ao fazer login! Por favor tente novamente ou contate um administrador.'
      ) // ? Caso ocorra um erro, mostra uma mensagem na tela para o usuário.

      // console.error('signInError', error) // ? Imprime o erro no console.
    }
  },
  signOut: async () => {
    try {
      setState(state => ({ ...state, isAuthLoading: true })) // ? Seta o estado isAuthLoading para true antes de executar as alterações.
      await auth.signOut() // ? Efetua o logout do usuário.
      setState(
        // ? Retorna o estado de autenticação para o seu estado inicial.
        produce<State>(state => {
          state.user = userInitialState
          state.isAuth = false
          state.isAuthLoading = false
        })
      )
    } catch (error) {
      toast.error(
        'Erro ao fazer logout! Por favor, tente novamente ou contate um administrador.'
      ) // ? Caso ocorra um erro, mostra uma mensagem na tela para o usuário.

      // console.error('signOutError', error) // ? Imprime o erro no console.
    }
  },
  setUser: (user: User) => {
    try {
      setState(
        // ? Define o novo estado do usuário baseado nos dados providos pelos parâmetro { user }.
        produce<State>(state => {
          state.user = user
          state.isAuth = true
          state.isAuthLoading = false
        })
      )
    } catch (error) {
      toast.error(
        'Erro ao atualizar os dados do usuário! Por favor, tente novamente ou contate um administrador.'
      ) // ? Caso ocorra um erro, mostra uma mensagem na tela para o usuário.

      // console.error('setUserError', error) // ? Imprime o erro no console.
    }
  }
}))
