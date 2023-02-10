interface RecentConversationsCardProps {
  name: string
  lastMessage: string
  lastMessageTime: string
  messagesQnt: number
  profilePic: string
}
export function RecentConversationsCard({
  name,
  lastMessage,
  lastMessageTime,
  messagesQnt,
  profilePic
}: RecentConversationsCardProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-[2rem] border border-app-text/10 bg-app-backgroundLight p-4 text-xs transition-colors hover:border-app-text/30 hover:bg-app-backgroundLight/20 md:gap-4 md:text-sm lg:text-base">
      <img src={profilePic} className="w-[23%] rounded-full" />
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <p className="truncate text-sm font-bold text-app-text md:text-base">
          {name}
        </p>
        <p className="truncate text-app-light">{lastMessage}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="text-xs text-app-primary">{lastMessageTime}</p>
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-app-primary text-xs font-bold text-app-text">
          {messagesQnt}
        </span>
      </div>
    </div>
  )
}
