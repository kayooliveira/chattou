import { format } from 'date-fns'
import { IoMdClock } from 'react-icons/io'
import { useChatStore } from 'store/chat'
import { v4 } from 'uuid'

import { RecentConversationsCard } from '../RecentConversationsCard'

export function RecentConversations() {
  const chats = useChatStore(state => state.chats)
  return (
    <section className="flex w-full flex-1 flex-col gap-4 overflow-y-scroll scrollbar-thin scrollbar-track-app-backgroundLight scrollbar-thumb-app-primary scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
      <span className="flex w-fit items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-app-primary to-[#B66DFF] py-1.5 px-2.5 text-xs font-bold leading-none text-app-text">
        Recentes
        <IoMdClock />
      </span>
      <div className="flex h-full max-h-full w-full flex-col gap-4">
        <div className="relative flex flex-col justify-center gap-2 after:pointer-events-none after:fixed after:bottom-0 after:h-1/4 after:w-full after:bg-gradient-to-t after:from-app-background after:content-[''] after:lg:w-1/5">
          {chats &&
            chats.map(chat => (
              <RecentConversationsCard
                key={v4()}
                name={chat.name}
                lastMessage={chat.lastMessage}
                lastMessageTime={format(chat.lastMessageDate, 'dd/MM/yyyy')}
                messagesQnt={1}
                profilePic={chat.image}
              />
            ))}

          {/* <RecentConversationsCard
            name="Kaline (Luna)"
            lastMessage="Isso q n pode!"
            lastMessageTime="2 min"
            messagesQnt={2}
            profilePic="https://pps.whatsapp.net/v/t61.24694-24/321173410_582449893307395_5220122229470741790_n.jpg?ccb=11-4&oh=01_AdSAqt5Cbcg2TxD13dPIteucSA66BAOi3kvxi349Ip4Qag&oe=63F2CA0B"
          />
          <RecentConversationsCard
            name="Savio"
            lastMessage="Randolar randolar randolar randolar"
            lastMessageTime="5 min"
            messagesQnt={1}
            profilePic="https://pps.whatsapp.net/v/t61.24694-24/325793715_962615208055108_9002868011396268687_n.jpg?ccb=11-4&oh=01_AdTEIJ8jkRQiIq3JsP4K7o8PeUfGVIsA77vFPKjoAk3xNA&oe=63F2C27D"
          />
          <RecentConversationsCard
            name="Berenício"
            lastMessage="Eita como ta de boa!"
            lastMessageTime="4 min"
            messagesQnt={1}
            profilePic="https://pps.whatsapp.net/v/t61.24694-24/316452413_693609895767454_6516523516504109189_n.jpg?ccb=11-4&oh=01_AdQMSdyiN71qGhvbvhJZxAOZgtBGPQcBhwq1gHufm6Us8Q&oe=63F2B9A5"
          />
          <RecentConversationsCard
            name="Eliza"
            lastMessage="Ta bom xuxu ❤"
            lastMessageTime="6 min"
            messagesQnt={2}
            profilePic="https://pps.whatsapp.net/v/t61.24694-24/324681967_204867555446011_7520175057960077826_n.jpg?ccb=11-4&oh=01_AdTQKNenlC32irGonGlKr41C0qHvspPXqCH8SABu49FflA&oe=63F293DA"
          /> */}
        </div>
      </div>
    </section>
  )
}
