import { format } from 'date-fns'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore'
import { database } from 'lib/firebase'
import { useEffect } from 'react'
import { IoMdClock } from 'react-icons/io'
import { useAuthStore } from 'store/auth'
import { Chat, useChatStore } from 'store/chat'

import { RecentConversationsCard } from '../RecentConversationsCard'
export function RecentConversations() {
  const chats = useChatStore(state => state.chats)

  const user = useAuthStore(state => state.user)
  const addNewChat = useChatStore(state => state.addNewChat)
  useEffect(() => {
    const getChats = async () => {
      const chatsRef = collection(database, 'chats')
      const chatsQuery = query(
        chatsRef,
        orderBy('lastMessageDate', 'asc'),
        where('users', 'array-contains', user.id)
      )
      const unsub = onSnapshot(chatsQuery, querySnap => {
        querySnap.forEach(async document => {
          if (document.exists()) {
            const data = document.data()
            if (data) {
              const usersDoc = doc(
                database,
                'users',
                data.users.find((chatUser: string) => chatUser !== user.id)
              )
              const user2Data = await getDoc(usersDoc).then(user2Doc => {
                if (user2Doc.exists()) {
                  const data = user2Doc.data()
                  if (data) {
                    return data
                  }
                }
              })
              const chat: Chat = {
                id: document.id,
                lastMessage: data.lastMessage,
                lastMessageDate: new Date(data.lastMessageDate.seconds * 1000),
                name: user2Data?.name,
                users: data.users,
                image: user2Data?.profilePic,
                messages: []
              }
              addNewChat(chat)
            }
          }
        })
      })
      return unsub
    }
    getChats()
  }, [])
  return (
    <section className="-mx-4 flex w-full flex-1 shrink-0 flex-col gap-4 overflow-y-scroll px-4 scrollbar-thin scrollbar-track-app-backgroundLight scrollbar-thumb-app-primary scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
      <span className="flex w-fit items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-app-primary to-[#B66DFF] py-1.5 px-2.5 text-xs font-bold leading-none text-app-text">
        Recentes
        <IoMdClock />
      </span>
      <div className="flex h-full max-h-full w-full flex-col gap-4">
        <div className="flex flex-col justify-start gap-2 after:pointer-events-none after:absolute after:bottom-0 after:h-1/4 after:w-full after:bg-gradient-to-t after:from-app-background after:content-[''] after:lg:hidden">
          {chats &&
            chats.map(chat => (
              <RecentConversationsCard
                key={chat.id}
                chatId={chat.id}
                name={chat.name}
                lastMessage={chat.lastMessage}
                lastMessageTime={format(chat.lastMessageDate, 'dd/MM/yyyy')}
                messagesQnt={1}
                profilePic={chat.image}
              />
            ))}
          <div className="h-20 w-full lg:hidden" />
        </div>
      </div>
    </section>
  )
}
