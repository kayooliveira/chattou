import { collection, getDoc, doc, setDoc } from 'firebase/firestore'
import { produce } from 'immer'
import { database } from 'lib/firebase'
import { v4 } from 'uuid'
import create from 'zustand'

export interface Message {
  chatId: string
  content: string
  contentType: 'text' | 'image' | 'audio' | 'video' | 'file'
  time: Date
  sender: string
  recipient: string
}

export interface Chat {
  id: string
  lastMessage: string
  lastMessageDate: Date
  name: string
  users: string[]
  image: string
  messages: Message[]
}
interface State {
  chats: Chat[]
  currentConversation: string
  isChatsLoading?: boolean
  isMessagesLoading?: boolean
  createChat: (user1Id: string, user2Id: string) => Promise<void>
  addMessage: (message: Message) => Promise<void>
  setChatMessages: (chatId: string, messages: Message[]) => void
  setChatMessage: (chatId: string, message: Message) => void
  setChats: (chats: Chat[]) => void
  setCurrentConversation: (chatId: string) => void
}

const MessageInitialState: Message = {
  chatId: '',
  content: '',
  contentType: 'text',
  recipient: '',
  sender: '',
  time: new Date()
}

const ChatsInitialState: Chat[] = [
  {
    id: '',
    lastMessage: '',
    lastMessageDate: new Date(),
    name: '',
    users: [],
    image: '',
    messages: [MessageInitialState]
  }
]

export const useChatStore = create<State>(setState => ({
  chats: ChatsInitialState,
  currentConversation: '',
  createChat: async (user1Id, user2Id) => {
    const usersRef = collection(database, 'users')

    const user2Data = await getDoc(doc(usersRef, user2Id)).then(doc => {
      if (doc.exists()) {
        if (doc.data()) {
          return doc.data()
        }
      }
    })
    if (user2Data) {
      const chatId = v4()
      const chat: Chat = {
        id: chatId,
        lastMessage: '',
        lastMessageDate: new Date(),
        name: user2Data.name,
        users: [user1Id, user2Id],
        image: user2Data.image,
        messages: []
      }
      setState(
        produce<State>(state => {
          state.chats?.push(chat)
        })
      )
      const chatsRef = collection(database, 'chats')
      await setDoc(doc(chatsRef, chatId), chat)
    }
  },
  addMessage: async message => {
    const messagesRef = collection(database, 'messages')
    const messageId = v4()
    await setDoc(doc(messagesRef, messageId), message)
  },
  setChats: chats => {
    setState(
      produce<State>(state => {
        state.chats = chats
      })
    )
  },
  setChatMessages: (chatId, messages) => {
    setState(
      produce<State>(state => {
        const chatIndex = state.chats.findIndex(chat => chat.id === chatId)
        const chat = state.chats[chatIndex]
        if (chat) {
          state.chats[chatIndex].messages = messages
        }
      })
    )
  },
  setChatMessage: (chatId, message) => {
    setState(
      produce<State>(state => {
        const chatIndex = state.chats.findIndex(chat => chat.id === chatId)
        const chat = state.chats[chatIndex]
        if (chat) {
          state.chats[chatIndex].messages.push(message)
        }
      })
    )
  },
  setCurrentConversation: chatId => {
    setState(
      produce<State>(state => {
        state.currentConversation = chatId
      })
    )
  }
}))
