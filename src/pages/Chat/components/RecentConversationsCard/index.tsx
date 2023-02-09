import friend from 'assets/img/friends/friend1.png'
interface RecentConversationsCardProps {
  name: string
  lastMessage: string
  lastMessageTime: string
  messagesQnt: number
}
export function RecentConversationsCard({
  name,
  lastMessage,
  lastMessageTime,
  messagesQnt
}: RecentConversationsCardProps) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-app-text/10 bg-app-backgroundLight p-4">
      <div className="flex items-center justify-center gap-2">
        <img src={friend} className="rounded-full" />
        <div className="flex flex-col gap-2">
          <span className="text-app-text">{name}</span>
          <span className="font-bold text-app-text">{lastMessage}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-app-primary">{lastMessageTime}</span>
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-app-primary font-bold text-app-text">
          {messagesQnt}
        </span>
      </div>
    </div>
  )
}
