import {
  collection,
  getDoc,
  getDocs,
  query,
  doc,
  where
} from 'firebase/firestore'
import { database } from 'lib/firebase'
import { useEffect } from 'react'
import { useAuthStore } from 'store/auth'
import { Chat as IChat, useChatStore } from 'store/chat'

import { CurrentConversation } from './components/CurrentConversation'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { RecentConversations } from './components/RecentConversations'

export function Chat() {
  const user = useAuthStore(state => state.user)
  const setChats = useChatStore(state => state.setChats)
  useEffect(() => {
    if (user) {
      const getChats = async () => {
        const chatsRef = collection(database, 'chats')
        const chatsQuery = query(
          chatsRef,
          where('users', 'array-contains', user.id)
        )
        const querySnap = await getDocs(chatsQuery)
        const chats: IChat[] = []

        querySnap.forEach(async document => {
          if (document.exists()) {
            const data = document.data()
            if (data) {
              const usersDoc = doc(database, 'users', data.users[1])
              const user2Data = await getDoc(usersDoc).then(user2Doc => {
                if (user2Doc.exists()) {
                  const data = user2Doc.data()
                  if (data) {
                    return data
                  }
                }
              })
              const chat: IChat = {
                id: document.id,
                lastMessage: data.lastMessage,
                lastMessageDate: new Date(data.lastMessageDate.seconds * 1000),
                name: data.name,
                users: data.users,
                image: user2Data?.profilePic,
                messages: []
              }
              setChats([...chats, chat])
            }
          }
        })
      }

      getChats()
    }
  }, [user])

  return (
    <div className="mx-auto flex h-screen max-h-screen max-w-screen-2xl gap-4 bg-app-background p-8">
      <div className="relative flex h-full max-w-full flex-col md:w-2/5 lg:w-1/3">
        <Header />
        <RecentConversations />
      </div>
      <CurrentConversation />
      <Footer />
    </div>
  )
}
