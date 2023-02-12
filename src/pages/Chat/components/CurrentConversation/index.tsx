import { faker } from '@faker-js/faker'
import classNames from 'classnames'
import { format } from 'date-fns'
import EmojiPicker, {
  // eslint-disable-next-line import/named
  EmojiClickData,
  EmojiStyle,
  Theme
} from 'emoji-picker-react'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore'
import { produce } from 'immer'
import { database } from 'lib/firebase'
import {
  FormEvent,
  useRef,
  useEffect,
  ChangeEvent,
  useState,
  KeyboardEvent
} from 'react'
import { isMobile } from 'react-device-detect'
import { IoMdCloseCircle, IoMdHappy, IoMdSend } from 'react-icons/io'
import TextareaAutosize from 'react-textarea-autosize'
import { useAuthStore, User } from 'store/auth'
import { Conversation, Message, useConversationStore } from 'store/conversation'
import { v4 } from 'uuid'

import { CurrentConversationMessageBubble } from '../CurrentConversationMessageBubble'

/**
 * @version 0.0.2
 *
 * @author Kayo Oliveira <contato@kayooliveira.com>
 *
 * @description Exibe a conversa atual do usuário em tela, o componente também é responsável por gerenciar mensagens recebidas e enviadas pelo usuário bem como envio de emojis e etc.
 *
 * @return ReactElement
 */

export function CurrentConversation(): React.ReactElement {
  const [activeConversation, setActiveConversation] = useState<
    Conversation | undefined
  >(undefined) // ? Estado responsável por armazenar os dados da conversa ativa no momento.

  const [activeConversationUser, setActiveConversationUser] = useState<
    User | undefined
  >(undefined) // ? Estado responsável por armazenar os dados do usuário 2 da conversa atualmente ativa.

  const [currentMessage, setCurrentMessage] = useState<string>('') // ? Estado responsável por armazenar o valor do input onde o usuário irá digitar a mensagem a ser enviada.

  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false) // ? Estado responsável por armazenar se deve ou não mostrar o componente EmojiPicker.

  const currentConversation = useConversationStore(
    state => state.currentConversation
  )

  const conversations = useConversationStore(state => state.conversations)

  const isCurrentConversationOpen = useConversationStore(
    state => state.isCurrentConversationOpen
  )

  const toggleCurrentConversation = useConversationStore(
    state => state.toggleCurrentConversation
  )

  const user = useAuthStore(state => state.user)

  const addMessageToCurrentConversation = useConversationStore(
    state => state.addMessageToCurrentConversation
  )

  const setCurrentConversationMessagesAsRead = useConversationStore(
    state => state.setCurrentConversationMessagesAsRead
  )

  const messagesEndRef = useRef<HTMLDivElement>(null) // ? Referência da div final das mensagens (utilizado para fazer com que o usuário seja levado até a última mensagem recebida ou enviada).

  const formRef = useRef<HTMLFormElement>(null) // ? Referência do formulário (utilizado para forçar o submit quando o usuário pressionar as teclas "Enter" enquanto estiver com foco na tag textarea).

  const textareaRef = useRef<HTMLTextAreaElement>(null) // ? Referência da tag textarea (utilizado para garantir que o foco seja retornado para o textarea após o usuário selecionar um emoji da lista).

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Função responsável por levar o usuário até a última mensagem recebida ou enviada.
   *
   * @return void
   */

  function scrollToBottom(): void {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) // ? A propriedade behavior: 'smooth' é definida aqui para que o scroll tenha uma animação mais suave.
  }

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Responsável por definir a conversa ativa no momento e resgatar os dados da mesma do banco de dados.
   */

  useEffect(() => {
    if (currentConversation) {
      setActiveConversation(
        conversations.find(
          conversation => conversation.id === currentConversation.conversationId
        )
      ) // ? Se houver uma conversa ativa, seta a mesma no estado do componente.

      const messagesRef = collection(
        database,
        `conversations/${currentConversation.conversationId}/messages`
      ) // ? Referência do banco de dados das mensagens da conversa atualmente selecionada.

      const messagesQuery = query(messagesRef, orderBy('time', 'asc')) // ? Ordena as mensagens da mais recente.

      const unsub = onSnapshot(messagesQuery, async querySnapshot => {
        const messages: Message[] = [] // ? Variável que conterá as mensagens recebidas do banco de dados.

        querySnapshot.forEach(messageDoc => {
          if (messageDoc.exists()) {
            // ? Se a doc da mensagem existir

            const messageData = messageDoc.data()

            if (messageData) {
              // ? Se os dados da mensagem existir então adiciona a mensagem atual na variavel 'messages' definida anteriormente.

              const newMessageData = {
                id: messageDoc.id,
                ...messageData,
                time: new Date(messageData.time.seconds * 1000)
              } as Message

              messages.push(newMessageData)
            }
          }
        })
        const unreadMessages = messages.filter(
          message => message.sender !== user.id && !message.isRead
        )
        if (unreadMessages) {
          const unreadMessagesIds = unreadMessages.map(message => message.id)
          await setCurrentConversationMessagesAsRead(unreadMessagesIds)
        }
        setActiveConversation(
          // ? Seta os dados das mensagens no estado do componente.
          produce<Conversation>(state => {
            state.messages = messages
          })
        )
      })
      return unsub
    }
  }, [currentConversation])

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Função responsável por gerenciar o valor do input referente a mensagem atual que o usuário está escrevendo.
   *
   * @param e ChangeEvent
   *
   * @return void
   */

  function handleChangeMessageContent(
    e: ChangeEvent<HTMLTextAreaElement>
  ): void {
    const value = e.target.value
    setCurrentMessage(value)
    if (showEmojiPicker) {
      // ? Se o EmojiPicker estiver aberto, então o fecha.
      toggleEmojiPicker()
    }
  }

  async function handleAddNewMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // ? Previne que ocorra um reload da página ao enviar o formulário.
    if (showEmojiPicker) {
      // ? Seo EmojiPicker estiver aberto, então o fecha.
      toggleEmojiPicker()
    }
    if (currentMessage.trim().length <= 0) return // ? Se o conteúdo da mensagem for vazio então retorna.

    if (activeConversation) {
      // ? Caso haja uma conversa ativa então adiciona o conteúdo da nova mensagem no banco de dados e reseta o estado do currentMessage.
      const messageId = v4() // ? Gera um novo ID para a mensagem.
      await addMessageToCurrentConversation(activeConversation.id, {
        id: messageId,
        body: currentMessage.trimStart().trimEnd(),
        type: 'text',
        sender: user.id,
        time: new Date(),
        isRead: false
      })
      setCurrentMessage('')
    }
  }

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Retorna um horário no formato HH:mm baseado na data recebida.
   *
   * @param date Data para ser formatada.
   *
   * @return {string} string Hora no formato HH:mm ex: 12:00
   */

  function formatMessageTime(date: Date): string {
    const formattedDateToTime = format(date, 'HH:mm')
    return formattedDateToTime
  }

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Função que executa cada vez que a conversa ativa muda, ela é executada para carregar os dados da nova conversa.
   */

  useEffect(() => {
    const controller = new AbortController()
    if (activeConversation) {
      const getActiveConversationUser = async () => {
        const usersRef = collection(database, 'users') // ? Referência dos usuários no banco de dados.
        const usersDoc = doc(
          usersRef,
          activeConversation.users.find(
            activeConversationUser => activeConversationUser !== user.id
          )
        ) // ? Doc do usuário 2 da conversa atual.

        await getDoc(usersDoc).then(doc => {
          if (doc.exists()) {
            // ? Se a doc do usuário existir
            const activeUserData = doc.data() as User

            if (activeUserData) {
              // ? Se existir dados na doc do usuário então seta o mesmo no estado do componente.
              setActiveConversationUser(activeUserData)
            }
          }
        })
      }
      getActiveConversationUser()
    }
    return () => controller.abort()
  }, [activeConversation])

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Função executada cada vez que as mensagens da conversa forem atualizadas, a função da mesma é levar o usuário até a última mensagem enviada ou recebida.
   */

  useEffect(() => {
    scrollToBottom()
  }, [activeConversation?.messages])

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Função responsável por fazer o envio do formulário caso o usuário pressione a tecla 'Enter' e estiver com foco no textarea de conteúdo de nova mensagem.
   *
   * @param e KeyboardEvent<HTMLTextareaElement>
   *
   * @return void
   */

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey && formRef.current) {
      e.preventDefault()
      formRef.current.requestSubmit()
    }
  }

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Função responsável por mostrar e/ou esconder o EmojiPicker.
   *
   * @return void
   */

  function toggleEmojiPicker(): void {
    setShowEmojiPicker(!showEmojiPicker)
    textareaRef.current?.focus()
  }

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Função responsável por adicionar o emoji selecionado pelo usuário no conteúdo da mensagem a ser enviada.
   *
   * @param emoji EmojiClickData
   *
   * @return void
   */

  function handleAddEmojiToMessage(emoji: EmojiClickData): void {
    setCurrentMessage(state => state + emoji.emoji)
  }

  return (
    <div
      className={classNames(
        'flex-1 flex-col items-center justify-center rounded-3xl border-2 border-app-backgroundLight bg-app-background p-4 lg:relative lg:flex',
        {
          'fixed top-0 left-0 z-40 h-screen max-h-screen w-screen p-2 ':
            isCurrentConversationOpen,
          'hidden ': !isCurrentConversationOpen
        }
      )}
    >
      {activeConversation && activeConversationUser ? (
        <>
          <header className="relative z-10 flex w-full items-center justify-between rounded-[2rem] rounded-bl-none rounded-br-none bg-app-backgroundLight to-transparent py-2 px-4 after:pointer-events-none after:absolute after:left-0 after:-bottom-20 after:h-20 after:w-full after:bg-gradient-to-b after:from-app-backgroundLight/50 after:content-[''] ">
            <div className="flex items-center justify-start gap-4">
              <img
                src={activeConversationUser.avatar}
                className="w-[5rem] rounded-full"
                referrerPolicy="no-referrer"
                alt=""
              />
              <div className="flex flex-col items-start justify-center text-app-text">
                <p className="text-xl font-bold">
                  {activeConversationUser.name}
                </p>
                <p className="text-xs text-app-light">
                  @{faker.internet.userName(activeConversationUser.name)}
                </p>
              </div>
            </div>
            {isCurrentConversationOpen && isMobile && (
              <button
                onClick={toggleCurrentConversation}
                className="rounded-full p-2 text-app-light outline-none focus:bg-app-primary hover:bg-app-primary"
              >
                <IoMdCloseCircle size="32" />
              </button>
            )}
          </header>
          <main className="flex h-[calc(100%_-_9.5rem)] w-full flex-1 flex-col justify-between overflow-y-scroll pt-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-app-backgroundLight scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
            <div className="flex-1">
              <div className="mb-4 w-full text-center text-app-light">
                <span className="rounded-full bg-app-backgroundLight py-2 px-3">
                  Este é o início de suas mensagens com{' '}
                  <b>{activeConversation.name}</b>
                </span>
              </div>
              {activeConversation.messages.map(message => (
                <CurrentConversationMessageBubble
                  key={message.id}
                  message={message.body}
                  messageAction={message.sender === user.id ? 'out' : 'in'}
                  messageTime={formatMessageTime(message.time)}
                />
              ))}
            </div>
            <div ref={messagesEndRef} />
          </main>
          <form
            ref={formRef}
            onSubmit={handleAddNewMessage}
            className="relative flex  w-full items-center justify-between gap-4 rounded-full border border-transparent bg-app-backgroundLight p-2 px-4 focus-within:border-app-light/30"
          >
            <div className="absolute bottom-20 left-0">
              {showEmojiPicker && (
                <EmojiPicker
                  height="350px"
                  lazyLoadEmojis
                  emojiStyle={EmojiStyle.NATIVE}
                  onEmojiClick={handleAddEmojiToMessage}
                  theme={Theme.DARK}
                  searchPlaceHolder="Buscar"
                  previewConfig={{
                    showPreview: false
                  }}
                  searchDisabled={true}
                />
              )}
            </div>
            <button
              onClick={toggleEmojiPicker}
              type="button"
              className={classNames(
                'rounded-full p-2 text-app-light outline-none transition-colors hover:bg-app-primary',
                {
                  'bg-app-primary': showEmojiPicker
                }
              )}
            >
              <IoMdHappy size="24" />
            </button>
            <TextareaAutosize
              ref={textareaRef}
              name="message"
              minRows={1}
              maxRows={6}
              onKeyDown={handleKeyDown}
              id="message"
              value={currentMessage}
              onChange={handleChangeMessageContent}
              className="block max-h-14 flex-1 resize-none border-none bg-transparent text-app-primary outline-none scrollbar-thin scrollbar-track-app-background scrollbar-thumb-app-primary scrollbar-track-rounded-full scrollbar-thumb-rounded-full placeholder:text-app-primary"
              placeholder="Digite sua mensagem!"
            />
            <button
              type="submit"
              className="ml-4 rounded-full bg-app-primary p-2 text-white transition-all hover:bg-app-primary/50"
            >
              <IoMdSend size="24" />
            </button>
          </form>
        </>
      ) : (
        <h1 className="block p-4 text-center text-3xl font-bold uppercase text-app-light">
          Clique em uma conversa para iniciar o conversation!
        </h1>
      )}
    </div>
  )
}
