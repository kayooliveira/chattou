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
}

const ConversationsInitialState: Conversation[] = []

/**
 * @version 1.0.0 // ! Última refatoração: 11/02/2023
 *
 * @author Kayo Oliveira <contato@kayooliveira.com>
 *
 * @description 'Store' responsável por gerenciar os estados referentes às conversas e mensagens do usuário autenticado na aplicação.
 *
 */

export const useConversationStore = create<State>((setState, getState) => ({
  conversations: ConversationsInitialState,
  currentConversation: undefined,
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
      const conversationId = v4() // ? Definindo o ID únido da conversa.
      const conversation: Conversation = {
        id: conversationId,
        users: [user1, user2],
        messages: [],
        image: user2Data.avatar,
        name: user2Data.name
      }

      setState(
        // ? Adiciona a nova conversa à lista de conversas no estado.
        produce<State>(state => {
          state.conversations?.push(conversation)
        })
      )

      const chatsRef = collection(database, 'conversations') // ? Referência das conversas no banco de dados.
      await setDoc(doc(chatsRef, conversationId), conversation) // ? Adiciona a nova conversa ao banco de dados.
    }
  },
  setConversations: conversations => {
    setState(
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
  }
}))
