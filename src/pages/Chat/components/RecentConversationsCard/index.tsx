import { format } from 'date-fns'
import { useAuthStore } from 'store/auth'
import { useConversationStore } from 'store/conversation'
interface RecentConversationsCardProps {
  name: string
  conversationId: string
  lastMessage?: string
  lastMessageDate?: Date
  unreadMessagesQnt?: number
  avatar: string
}

/**
 * @version 0.0.1
 *
 * @author Kayo Oliveira <contato@kayooliveira.com>
 *
 * @description Card que exibe informações individuais das últimas conversas do usuário.
 *
 * @param { RecentConversationsCardProps } props
 * @param { string } props.name Nome do usuário.
 * @param { string } props.avatar URL do avatar do usuário.
 * @param { string } props.conversationId Id da conversa.
 * @param { string | undefined } props.lastMessage Última mensagem enviada na conversa.
 * @param { Date | undefined } props.lastMessageDate Data da última mensagem enviada.
 * @param { unreadMessagesQnt | undefined } props.unreadMessagesQnt Quantidade de mensagens não lidas na conversa.
 *
 * @return ReactElement
 */

export function RecentConversationsCard({
  name,
  conversationId,
  lastMessage,
  lastMessageDate,
  unreadMessagesQnt = 0,
  avatar
}: RecentConversationsCardProps): React.ReactElement {
  const setCurrentConversation = useConversationStore(
    state => state.setCurrentConversation
  )
  const user = useAuthStore(state => state.user)

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Altera a conversa ativa no momento.
   *
   * @return Promise<void>
   */

  async function handleChangeCurrentConversation(): Promise<void> {
    if (user) {
      await setCurrentConversation(user.id, conversationId)
    }
  }

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Retorna o horário de envio da última mensagem da conversa.
   *
   * @param date
   *
   * @return string
   */

  function formatLastMessageDate(date: Date): string {
    return format(date, 'HH:mm')
  }

  return (
    <div
      onClick={handleChangeCurrentConversation}
      className="flex cursor-pointer items-center justify-between gap-2 rounded-[2rem] border border-app-text/10 bg-app-backgroundLight p-4 text-xs transition-colors hover:border-app-text/30 hover:bg-app-backgroundLight/20 md:gap-4 md:text-sm lg:text-base"
    >
      <img
        src={avatar}
        className="w-[6rem] rounded-full"
        referrerPolicy="no-referrer"
        alt={name + ' avatar'}
      />
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <p className="truncate text-sm font-bold text-app-text md:text-base">
          {name}
        </p>
        <p className="truncate text-app-light">{lastMessage}</p>
      </div>
      {lastMessageDate && (
        <div className="flex shrink-0 flex-col items-end gap-2">
          <p className="text-xs text-app-primary">
            {formatLastMessageDate(lastMessageDate)}
          </p>
          {unreadMessagesQnt > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-app-primary text-xs font-bold text-app-text">
              {unreadMessagesQnt}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
