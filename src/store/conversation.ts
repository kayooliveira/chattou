import {
  collection,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  increment
} from 'firebase/firestore'
import { produce } from 'immer'
import { database } from 'lib/firebase'
import { toast } from 'react-hot-toast'
import { v4 } from 'uuid'
import { create } from 'zustand'

import { User } from './auth'

export interface Message {
  id: string
  isRead: boolean
  sender: string
  time: Date
  type: 'text'
  body: string
  // replyTo?: string
}

export interface Conversation {
  id: string
  lastMessage?: string
  lastMessageDate?: Date
  unreadMessagesQnt?: number
  users: string[]
  messages: Message[]
  image: string
  name: string
}

export interface CurrentConversation {
  conversationId: string
  with: User
  messages: Message[]
}

interface State {
  conversations: Conversation[]
  currentConversation?: CurrentConversation
  isCurrentConversationOpen: boolean
  toggleCurrentConversation: () => void
  openCurrentConversation: () => void
  closeCurrentConversation: () => void
  isChatsLoading?: boolean
  createConversation: (user1: string, user2: string) => Promise<void>
  addNewConversation: (conversation: Conversation) => void
  setConversationMessages: (conversationId: string, messages: Message[]) => void
  addConversationMessage: (conversationId: string, message: Message) => void
  setConversations: (conversations: Conversation[]) => void
  setCurrentConversation: (
    userId: string,
    conversationId: string
  ) => Promise<void>
  addMessageToCurrentConversation: (
    conversationId: string,
    message: Message
  ) => Promise<void>
  setCurrentConversationMessagesAsRead: (messageIds: string[]) => Promise<void>
}

const ConversationsInitialState: Conversation[] = []

/**
 * @version 1.0.3 // ! Última refatoração: 11/02/2023
 *
 * @author Kayo Oliveira <contato@kayooliveira.com>
 *
 * @description 'Store' responsável por gerenciar os estados referentes às conversas e mensagens do usuário autenticado na aplicação.
 *
 */

export const useConversationStore = create<State>((setState, getState) => ({
  conversations: ConversationsInitialState,
  currentConversation: undefined,
  isCurrentConversationOpen: false,
  toggleCurrentConversation: () => {
    const actualState = getState()
    if (!actualState.currentConversation) {
      toast.error('Selecione uma mensagem primeiro!')
      return
    }
    setState(
      produce<State>(state => {
        state.isCurrentConversationOpen = !actualState.isCurrentConversationOpen
      })
    )
  },
  openCurrentConversation: () => {
    const actualState = getState()
    if (!actualState.currentConversation) {
      toast.error('Selecione uma mensagem primeiro!')
      return
    }
    setState(
      produce<State>(state => {
        state.isCurrentConversationOpen = true
      })
    )
  },
  closeCurrentConversation: () => {
    setState(
      produce<State>(state => {
        state.isCurrentConversationOpen = false
      })
    )
  },
  createConversation: async (user1, user2) => {
    const usersRef = collection(database, 'users') // ? Referência de usuários no banco de dados.

    const user2Data = await getDoc(doc(usersRef, user2)).then(doc => {
      // ? Resgatando os dados do usuário 2 e verificando se o mesmo existe.
      if (doc.exists()) {
        if (doc.data()) {
          return doc.data() // ? Se o usuário existir, retorna os dados do mesmo para a variável user2Data.
        }
      }
    })

    if (user2Data) {
      // ? Verifica se o usuário 2 foi encontrado
      const actualState = getState() // ? O estado atual
      const actualConversations = actualState.conversations // ? As conversas do estado atual.
      const conversationExists = actualConversations.find(
        ac => ac.users.includes(user1) && ac.users.includes(user2)
      ) // ? Busca nas conversas do estado atual se a conversa que o usuário quer adicionar já existe.

      if (conversationExists) {
        // ? Se a conversa já existir, define a mesma como a conversa atualmente ativa.
        setState(
          produce<State>(state => {
            state.currentConversation = {
              conversationId: conversationExists.id,
              messages: conversationExists.messages,
              with: user2Data as User
            }
          })
        )
        return // ? Retorna para prevenir duplicação de dados.
      }

      const conversationId = v4() // ? Definindo o ID únido da conversa.
      const conversation: Conversation = {
        id: conversationId,
        users: [user1, user2],
        messages: [],
        image: user2Data.avatar,
        name: user2Data.name,
        lastMessage: '',
        lastMessageDate: new Date(),
        unreadMessagesQnt: 0
      }

      setState(
        // ? Adiciona a nova conversa à lista de conversas no estado.
        produce<State>(state => {
          state.isCurrentConversationOpen = true
          state.currentConversation = {
            conversationId: conversation.id,
            messages: conversation.messages,
            with: user2Data as User
          }
          state.conversations?.push(conversation)
        })
      )

      const chatsRef = collection(database, 'conversations') // ? Referência das conversas no banco de dados.
      await setDoc(doc(chatsRef, conversationId), conversation) // ? Adiciona a nova conversa ao banco de dados.
    }
  },
  setConversations: conversations => {
    setState(
      // ? Seta as conversas recebidas no estado da aplicação.
      produce<State>(state => {
        state.conversations = conversations
      })
    )
  },
  addNewConversation: conversation => {
    const state = getState() // ? Pega os dados do estado atual.
    const conversationExists = state.conversations.find(
      // ? Verifica se a conversa já existe no estado.
      c => c.id === conversation.id
    )

    if (conversationExists) {
      // ? Se a conversa já existir, apenas atualiza os dados da mesma.
      const conversationIndex = state.conversations.findIndex(
        c => c.id === conversation.id
      )

      setState(
        produce<State>(s => {
          s.conversations[conversationIndex] = conversation
        })
      )
      return // ? Para a função para evitar a duplicação de dados.
    }

    setState(
      // ? Caso a conversa ainda não exista, adiciona a mesma à lista de conversas.
      produce<State>(state => {
        state.conversations.push(conversation)
      })
    )
  },
  setConversationMessages: (conversationId, messages) => {
    setState(
      // ? Adiciona as mensagens recebidas no parâmetro à conversa referente ao respectivo ID.
      produce<State>(state => {
        const conversationIndex = state.conversations.findIndex(
          c => c.id === conversationId
        ) // ? Procura pelo índice do array cujo qual contém a conversa buscada.
        if (state.conversations[conversationIndex]) {
          // ? Verifica se a conversa existe no estado e adiciona as mensagens à mesma.
          state.conversations[conversationIndex].messages = messages
        }
      })
    )
  },
  addConversationMessage: (conversationId, message) => {
    setState(
      // ? Adiciona as mensagens recebidas no parâmetro à conversa referente ao respectivo ID.
      produce<State>(state => {
        const conversationIndex = state.conversations.findIndex(
          c => c.id === conversationId
        ) // ? Procura pelo índice do array cujo qual contém a conversa buscada.

        if (state.conversations[conversationIndex]) {
          // ? Verifica se a conversa existe no estado e adiciona as mensagens à mesma.
          state.conversations[conversationIndex].messages.push(message)
        }
      })
    )
  },
  setCurrentConversation: async (userId, conversationId) => {
    const state = getState() // ? Pega os dados do estado atual.

    if (
      state.currentConversation &&
      state.currentConversation.conversationId === conversationId
    )
      return

    const conversation = state.conversations.find(c => c.id === conversationId)
    if (conversation) {
      // ? Verifica se a conversa existe no estado, caso exista, adiciona a mesma como a conversa ativa no momento.
      const recipientId = conversation.users.find(user => user !== userId) // ? Busca pelo id na lista de usuários que não é igual ao usuário atual (id de quem recebe a mensagem).

      if (recipientId) {
        // ? Caso exista um id do destinatário busque os dados dele no database.
        const recipientDoc = doc(database, 'users', recipientId)
        const recipientData = await getDoc(recipientDoc).then(rdoc => {
          if (rdoc.exists()) {
            // ? Se o usuário existir verifica se os dados do mesmo existem no DB.
            const rdata = rdoc.data()

            if (rdata) return rdata // ? Caso exista, retorne os dados para a variável recipientData.
          }
        })

        if (recipientData) {
          // ? Se os dados do usuário existirem na variável.
          setState(
            // ? Define os dados da currentConversation.
            produce<State>(state => {
              state.isCurrentConversationOpen = true
              state.currentConversation = {
                conversationId: conversation.id,
                messages: conversation.messages,
                with: recipientData as User
              }
            })
          )
        }
      }
    }
  },
  addMessageToCurrentConversation: async (conversationId, message) => {
    const conversationDoc = doc(database, 'conversations', conversationId) // ? Referência da conversa no banco de dados.
    await updateDoc(conversationDoc, {
      // ? Atualiza os dados da conversa e adiciona a nova mensagem à mesma.
      lastMessage: message.body,
      lastMessageDate: message.time,
      unreadMessagesQnt: increment(1)
    })
    const { id, ...messageWithoutId } = message

    const messagesDoc = doc(
      database,
      `conversations/${conversationId}/messages/`,
      id
    )

    await setDoc(messagesDoc, messageWithoutId)
  },
  setCurrentConversationMessagesAsRead: async messageIds => {
    const actualState = getState() // ? Estado atual.

    const currentConversation = actualState.currentConversation // ? Conversa atual do usuário.

    if (!currentConversation) return // ? Caso a conversa não existir, retorna.

    const currentConversationConversationIndex =
      actualState.conversations.findIndex(
        conversation => conversation.id === currentConversation.conversationId
      ) // ? Conversation no estado global.

    setState(
      produce<State>(state => {
        state.conversations[
          currentConversationConversationIndex
        ].unreadMessagesQnt = 0
      })
    )
    messageIds.forEach(async id => {
      // ? Itera pelos ids das mensagens recebidas.
      const messagesDoc = doc(
        database,
        `conversations/${currentConversation.conversationId}/messages/`,
        id
      ) // ? Pega a doc da mensagem correspondente ao id iterado no momento.

      await updateDoc(messagesDoc, {
        isRead: true
      }) // ? Atualiza o campo isRead da mensagem.
    })
  }
}))
