import { faker } from '@faker-js/faker'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { database } from 'lib/firebase'
import { useEffect, ChangeEvent, useState } from 'react'
import { IoMdSend } from 'react-icons/io'
import { useAuthStore } from 'store/auth'
import { Chat, Message, useChatStore } from 'store/chat'

import { CurrentConversationMessageBubble } from '../CurrentConversationMessageBubble'

export function CurrentConversation() {
  const [activeChat, setActiveChat] = useState<Chat | undefined>(undefined)
  const currentConversation = useChatStore(state => state.currentConversation)
  const chats = useChatStore(state => state.chats)
  const user = useAuthStore(state => state.user)
  const addMessage = useChatStore(state => state.addMessage)
  const [currentMessage, setCurrentMessage] = useState<string>('')

  useEffect(() => {
    if (currentConversation) {
      setActiveChat(chats.find(chat => chat.id === currentConversation))
      const messagesRef = collection(database, 'messages')
      const messagesQuery = query(
        messagesRef,
        where('chatId', '==', currentConversation)
      )
      const unsub = onSnapshot(messagesQuery, querySnapshot => {
        querySnapshot.forEach(messageDoc => {
          if (messageDoc.exists()) {
            const messageData = messageDoc.data()
            if (messageData) {
              setActiveChat(state =>
                state
                  ? {
                      ...state,
                      messages: [
                        ...new Set([...state.messages, messageData as Message])
                      ]
                    }
                  : undefined
              )
            }
          }
        })
      })
      return unsub
    }
  }, [currentConversation])

  function handleChangeMessageContent(e: ChangeEvent<HTMLInputElement>) {
    setCurrentMessage(e.target.value)
  }

  async function handleAddNewMessage() {
    if (activeChat) {
      addMessage({
        chatId: currentConversation,
        content: currentMessage,
        contentType: 'text',
        recipient: activeChat.users[1],
        sender: activeChat.users[0],
        time: new Date()
      })
    }
  }
  return (
    <div className="hidden flex-1 flex-col rounded-3xl border-2 border-app-backgroundLight p-4 lg:flex">
      {activeChat && (
        <>
          <header className="relative z-10 flex w-full items-center justify-between rounded-full bg-app-backgroundLight to-transparent py-2 px-4 after:pointer-events-none after:absolute after:left-0 after:-bottom-20 after:h-20 after:w-full after:bg-gradient-to-b after:from-app-backgroundLight/50 after:content-[''] ">
            <div className="flex items-center justify-start gap-4">
              <img
                src={activeChat.image}
                className="w-[5rem] rounded-full"
                alt=""
              />
              <div className="flex flex-col items-start justify-center text-app-text">
                <p className="text-xl font-bold">{activeChat?.name}</p>
                <p className="text-xs text-app-light">
                  @{faker.internet.userName(activeChat.name)}
                </p>
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col justify-between overflow-y-scroll pt-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-app-backgroundLight scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
            <div className="flex-1">
              <div className="mb-7 w-full text-center text-app-light">
                <span className="rounded-full bg-app-backgroundLight py-3 px-6 font-bold">
                  28/12/2022
                </span>
              </div>
              {activeChat.messages.map(message => (
                <CurrentConversationMessageBubble
                  key={message.chatId + message.time}
                  message={message.content}
                  messageAction={message.sender === user.id ? 'out' : 'in'}
                  messageTime="20:31"
                />
              ))}
            </div>
            <form className="group flex items-center justify-between rounded-full border border-transparent bg-app-backgroundLight p-2 px-4 focus-within:border-app-light/30">
              <input
                name="message"
                id="message"
                onChange={handleChangeMessageContent}
                className="flex-1 border-none bg-transparent text-app-primary outline-none placeholder:text-app-primary"
                placeholder="Digite sua mensagem!"
              />
              <button
                type="button"
                onClick={handleAddNewMessage}
                className="rotate-90 rounded-full bg-app-primary p-2 text-white transition-all group-focus-within:rotate-0 group-hover:rotate-0 hover:bg-app-primary/50"
              >
                <IoMdSend size="24" />
              </button>
            </form>
          </main>
        </>
      )}
    </div>
  )
}
