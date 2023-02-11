import { faker } from '@faker-js/faker'
import { format } from 'date-fns'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  getDoc
} from 'firebase/firestore'
import { produce } from 'immer'
import { database } from 'lib/firebase'
import { FormEvent, useRef, useEffect, ChangeEvent, useState } from 'react'
import { IoMdSend } from 'react-icons/io'
import TextareaAutosize from 'react-textarea-autosize'
import { useAuthStore, User } from 'store/auth'
import { Chat, Message, useChatStore } from 'store/chat'
import { v4 } from 'uuid'

import { CurrentConversationMessageBubble } from '../CurrentConversationMessageBubble'

export function CurrentConversation() {
  const [activeChat, setActiveChat] = useState<Chat | undefined>(undefined)
  const [activeChatUser, setActiveChatUser] = useState<User | undefined>(
    undefined
  )
  const currentConversation = useChatStore(state => state.currentConversation)
  const chats = useChatStore(state => state.chats)
  const user = useAuthStore(state => state.user)
  const addMessage = useChatStore(state => state.addMessage)
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (currentConversation) {
      setActiveChat(chats.find(chat => chat.id === currentConversation))
      const messagesRef = collection(database, 'messages')
      const messagesQuery = query(
        messagesRef,
        orderBy('time', 'asc'),
        where('chatId', '==', currentConversation)
      )
      const unsub = onSnapshot(messagesQuery, querySnapshot => {
        const messages: Message[] = []
        querySnapshot.forEach(messageDoc => {
          if (messageDoc.exists()) {
            const messageData = messageDoc.data()
            if (messageData) {
              const newMessageData = {
                id: messageDoc.id,
                ...messageData,
                time: new Date(messageData.time.seconds * 1000)
              } as Message
              messages.push(newMessageData)
            }
          }
        })

        setActiveChat(
          produce<Chat>(state => {
            state.messages = messages
          })
        )
      })
      return unsub
    }
  }, [currentConversation])

  function handleChangeMessageContent(e: ChangeEvent<HTMLTextAreaElement>) {
    setCurrentMessage(e.target.value)
  }

  async function handleAddNewMessage(e: FormEvent<HTMLFormElement>) {
    if (activeChat) {
      e.preventDefault()
      const messageId = v4()
      await addMessage({
        id: messageId,
        chatId: currentConversation,
        content: currentMessage,
        contentType: 'text',
        recipient:
          activeChat.users.find(chatUser => chatUser !== user.id) || '',
        sender: user.id,
        time: new Date()
      })
      setCurrentMessage('')
    }
  }
  function formatMessageTime(date: Date) {
    const formattedDateToTime = format(date, 'HH:mm')
    return formattedDateToTime
  }

  useEffect(() => {
    if (activeChat) {
      const getActiveChatUser = async () => {
        const usersRef = collection(database, 'users')
        const usersDoc = doc(
          usersRef,
          activeChat.users.find(activeChatUser => activeChatUser !== user.id)
        )
        await getDoc(usersDoc).then(doc => {
          if (doc.exists()) {
            const activeUserData = doc.data() as User
            if (activeUserData) {
              setActiveChatUser(activeUserData)
            }
          }
        })
      }
      getActiveChatUser()
    }
  }, [activeChat])

  useEffect(() => {
    scrollToBottom()
  }, [activeChat?.messages])

  return (
    <div className="hidden flex-1 flex-col rounded-3xl border-2 border-app-backgroundLight p-4 lg:flex">
      {activeChat && activeChatUser && (
        <>
          <header className="relative z-10 flex w-full items-center justify-between rounded-full bg-app-backgroundLight to-transparent py-2 px-4 after:pointer-events-none after:absolute after:left-0 after:-bottom-20 after:h-20 after:w-full after:bg-gradient-to-b after:from-app-backgroundLight/50 after:content-[''] ">
            <div className="flex items-center justify-start gap-4">
              <img
                src={activeChatUser.profilePic}
                className="w-[5rem] rounded-full"
                referrerPolicy="no-referrer"
                alt=""
              />
              <div className="flex flex-col items-start justify-center text-app-text">
                <p className="text-xl font-bold">{activeChatUser.name}</p>
                <p className="text-xs text-app-light">
                  @{faker.internet.userName(activeChatUser.name)}
                </p>
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col justify-between overflow-y-scroll pt-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-app-backgroundLight scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
            <div className="flex-1">
              <div className="mb-4 w-full text-center text-app-light">
                <span className="rounded-full bg-app-backgroundLight py-2 px-3">
                  Este é o início de suas mensagens com <b>{activeChat.name}</b>
                </span>
              </div>
              {activeChat.messages.map(message => (
                <CurrentConversationMessageBubble
                  key={message.id}
                  message={message.content}
                  messageAction={message.sender === user.id ? 'out' : 'in'}
                  messageTime={formatMessageTime(message.time)}
                />
              ))}
            </div>
            <div ref={messagesEndRef} />
          </main>
          <form
            onSubmit={handleAddNewMessage}
            className="group flex items-center justify-between gap-8 rounded-full border border-transparent bg-app-backgroundLight p-2 px-4 focus-within:border-app-light/30"
          >
            <TextareaAutosize
              name="message"
              minRows={1}
              maxRows={6}
              id="message"
              value={currentMessage}
              onChange={handleChangeMessageContent}
              className="block max-h-14 flex-1 resize-none border-none bg-transparent text-app-primary outline-none scrollbar-thin scrollbar-track-app-background scrollbar-thumb-app-primary scrollbar-track-rounded-full scrollbar-thumb-rounded-full placeholder:text-app-primary"
              placeholder="Digite sua mensagem!"
            />
            <button
              type="submit"
              className="rotate-90 rounded-full bg-app-primary p-2 text-white transition-all group-focus-within:rotate-0 group-hover:rotate-0 hover:bg-app-primary/50"
            >
              <IoMdSend size="24" />
            </button>
          </form>
        </>
      )}
    </div>
  )
}
