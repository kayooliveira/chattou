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
import { Conversation, useConversationStore } from 'store/conversation'

import { RecentConversationsCard } from '../RecentConversationsCard'

/**
 * @version 0.0.1
 *
 * @author Kayo Oliveira <contato@kayooliveira.com>
 *
 * @description Mostra as conversas recentes do usuário em tela.
 *
 * @return ReactElement
 */

export function RecentConversations(): React.ReactElement {
  const conversations = useConversationStore(state => state.conversations)

  const user = useAuthStore(state => state.user)

  const addNewConversation = useConversationStore(
    state => state.addNewConversation
  )

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Função responsável por carregar os dados das conversas do usuário e setá-las no estado global da aplicação.
   */

  useEffect(() => {
    const getConversations = async () => {
      const conversationsRef = collection(database, 'conversations')
      const conversationsQuery = query(
        conversationsRef,
        orderBy('lastMessageDate', 'asc'),
        where('users', 'array-contains', user.id)
      )
      const unsub = onSnapshot(conversationsQuery, querySnap => {
        querySnap.forEach(async document => {
          if (document.exists()) {
            const data = document.data()
            if (data) {
              const usersDoc = doc(
                database,
                'users',
                data.users.find(
                  (conversationUser: string) => conversationUser !== user.id
                )
              ) // ? Doc dos usuários no banco de dados.

              const user2Data = await getDoc(usersDoc).then(user2Doc => {
                // ? Pega os dados do usuário 2 da conversa.
                if (user2Doc.exists()) {
                  // ? Se a doc existir
                  const data = user2Doc.data()
                  if (data) {
                    // ? Se existir os dados do usuário na doc então retorna os mesmos para a variável user2Data.
                    return data
                  }
                }
              })

              const conversation: Conversation = {
                // ? Cria uma nova conversa com os dados resgatados e envia para o banco de dados e estado global.
                id: document.id,
                lastMessage: data.lastMessage,
                lastMessageDate: new Date(data.lastMessageDate.seconds * 1000),
                name: user2Data?.name,
                users: data.users,
                image: user2Data?.avatar,
                messages: []
              }
              addNewConversation(conversation)
            }
          }
        })
      })
      return () => unsub()
    }
    getConversations()
  }, [])
  return (
    <section className="-mx-4 flex w-full flex-1 shrink-0 flex-col gap-4 overflow-y-scroll px-4 scrollbar-thin scrollbar-track-app-backgroundLight scrollbar-thumb-app-primary scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
      <span className="flex w-fit items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-app-primary to-[#B66DFF] py-1.5 px-2.5 text-xs font-bold leading-none text-app-text">
        Recentes
        <IoMdClock />
      </span>
      <div className="flex h-full max-h-full w-full flex-col gap-4">
        <div className="flex flex-col justify-start gap-2 after:pointer-events-none after:absolute after:bottom-0 after:h-1/4 after:w-full after:bg-gradient-to-t after:from-app-background after:content-[''] after:lg:hidden">
          {conversations &&
            conversations.map(conversation => (
              <RecentConversationsCard
                key={conversation.id}
                conversationId={conversation.id}
                name={conversation.name}
                lastMessage={conversation.lastMessage}
                lastMessageDate={conversation.lastMessageDate}
                unreadMessagesQnt={conversation.unreadMessagesQnt}
                avatar={conversation.image}
              />
            ))}
          <div className="h-20 w-full lg:hidden" />
        </div>
      </div>
    </section>
  )
}
