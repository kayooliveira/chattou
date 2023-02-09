import { useAuthStore } from 'store/auth'

export function Chat() {
  const user = useAuthStore(state => state.user)
  return (
    <div className="items start flex h-screen w-screen flex-col items-center justify-center gap-8 bg-home bg-cover bg-no-repeat font-brand text-app-text">
      <div className="flex items-center justify-center gap-8 rounded-md bg-app-background p-4">
        <img
          src={user.profilePic}
          referrerPolicy="no-referrer"
          className="w-1/2 rounded-full"
        />
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="whitespace-nowrap text-xl uppercase">{user.name}</p>
          <p className="text-app-light">@{user.username}</p>
        </div>
      </div>
    </div>
  )
}
