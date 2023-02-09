interface ActiveUserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  profilePic: string
  name: string
}

export function ActiveUserCard({ profilePic, name }: ActiveUserCardProps) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-2">
      <img src={profilePic} alt={name + ' user card'} />
      <span className="tex-text text-md font-bold">{name}</span>
    </div>
  )
}
