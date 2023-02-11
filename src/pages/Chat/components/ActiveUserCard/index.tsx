interface ActiveUserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  profilePic: string
  name: string
}

export function ActiveUserCard({ profilePic, name }: ActiveUserCardProps) {
  return (
    <div className="flex w-16 shrink-0 flex-col items-stretch justify-center gap-2 overflow-hidden">
      <img
        src={profilePic}
        alt={name + ' user card'}
        className="rounded-full"
      />
      <p className="truncate text-center font-bold">{name}</p>
    </div>
  )
}
