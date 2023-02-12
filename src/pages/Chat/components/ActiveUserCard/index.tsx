import { useAuthStore } from 'store/auth'
import { useConversationStore } from 'store/conversation'

interface ActiveUserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar: string
  name: string
  id: string
}

/**
 * @version 0.0.2
 *
 * @author Kayo Oliveira <contato@kayooliveira.com>
 *
 * @description 'Card' contendo avatar e nome do usuário definido.
 *
 * @param { ActiveUserCardProps } user Os dados do usuário.
 * @param { string } user.avatar URL do avatar do usuário.
 * @param { string } user.name Nome do usuário.
 * @param { string } user.id ID do usuário.
 *
 * @return ReactElement
 */

export function ActiveUserCard({
  avatar,
  name,
  id
}: ActiveUserCardProps): React.ReactElement {
  const user = useAuthStore(state => state.user)
  const createConversation = useConversationStore(
    state => state.createConversation
  )

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Cria uma nova conversa ao clicar no card do usuário.
   *
   * @return void
   */
  function handleCreateNewConversation(): void {
    createConversation(user.id, id)
  }
  return (
    <div
      onClick={handleCreateNewConversation}
      className="flex w-16 shrink-0 cursor-pointer flex-col items-stretch justify-center gap-2 overflow-hidden"
    >
      <img src={avatar} alt={name + ' user card'} className="rounded-full" />
      <p className="truncate text-center text-xs font-bold lg:text-base">
        {name}
      </p>
    </div>
  )
}
