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
  lastMessage: string
  lastMessageDate: Date
  name: string
  users: string[]
  image: string
}

interface State {
  chats?: Chat[]
  messages: Message[]
  createChat: (user1Id: string, user2Id: string) => Promise<void>
  addMessage: (message: Message) => Promise<void>
  setChats: (chats: Chat[]) => void
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
    lastMessage: '',
    lastMessageDate: new Date(),
    name: '',
    users: [],
    image: ''
  }
]

export const useChatStore = create<State>(setState => ({
  chats: ChatsInitialState,
  messages: [MessageInitialState],
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
      const chat: Chat = {
        lastMessage: '',
        lastMessageDate: new Date(),
        name: user2Data.name,
        users: [user1Id, user2Id],
        image: user2Data.image
      }
      setState(
        produce<State>(state => {
          state.chats?.push(chat)
        })
      )
      const chatsRef = collection(database, 'chats')
      await setDoc(doc(chatsRef, v4()), chat)
    }
  },
  addMessage: async message => {
    const messagesRef = collection(database, 'messages')
    await setDoc(doc(messagesRef, v4()), message)
  },
  setChats: chats => {
    setState(
      produce<State>(state => {
        state.chats = chats
      })
    )
  }
}))
