interface ActiveUserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar: string
  name: string
}

/**
 * @version 0.0.1
 *
 * @author Kayo Oliveira <contato@kayooliveira.com>
 *
 * @description 'Card' contendo avatar e nome do usuário definido.
 *
 * @param { ActiveUserCardProps } user Os dados do usuário.
 * @param { string } user.avatar URL do avatar do usuário.
 * @param { string } user.name Nome do usuário.
 *
 * @return ReactElement
 */

export function ActiveUserCard({
  avatar,
  name
}: ActiveUserCardProps): React.ReactElement {
  return (
    <div className="flex w-16 shrink-0 cursor-pointer flex-col items-stretch justify-center gap-2 overflow-hidden">
      <img src={avatar} alt={name + ' user card'} className="rounded-full" />
      <p className="truncate text-center text-xs font-bold lg:text-base">
        {name}
      </p>
    </div>
  )
}
