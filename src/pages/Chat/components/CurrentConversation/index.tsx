import { faker } from '@faker-js/faker'

import { CurrentConversationMessageBubble } from '../CurrentConversationMessageBubble'

export function CurrentConversation() {
  return (
    <div className="hidden flex-1 flex-col rounded-3xl border-2 border-app-backgroundLight p-4 lg:flex">
      <header className="relative z-10 flex w-full items-center justify-between rounded-full bg-app-backgroundLight to-transparent py-2 px-4 after:pointer-events-none after:absolute after:left-0 after:-bottom-20 after:h-20 after:w-full after:bg-gradient-to-b after:from-app-backgroundLight/50 after:content-[''] ">
        <div className="flex items-center justify-start gap-4">
          <img
            src={faker.internet.avatar()}
            className="w-[5rem] rounded-full"
            alt=""
          />
          <div className="flex flex-col items-start justify-center text-app-text">
            <p className="text-xl font-bold">{faker.name.fullName()}</p>
            <p className="text-xs text-app-light">
              @{faker.internet.userName()}
            </p>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-scroll pt-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-app-backgroundLight scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
        <div className="mb-7 w-full text-center text-app-light">
          <span className="rounded-full bg-app-backgroundLight py-3 px-6 font-bold">
            28/12/2022
          </span>
        </div>
        <CurrentConversationMessageBubble
          message="Salve carai"
          messageAction="in"
          messageTime="20:31"
        />
        <CurrentConversationMessageBubble
          message="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
          messageAction="out"
          messageTime="20:40"
        />
        <CurrentConversationMessageBubble
          message="Salve carai"
          messageAction="in"
          messageTime="20:31"
        />
        <CurrentConversationMessageBubble
          message="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
          messageAction="out"
          messageTime="20:40"
        />
        <CurrentConversationMessageBubble
          message="Salve carai"
          messageAction="in"
          messageTime="20:31"
        />
        <CurrentConversationMessageBubble
          message="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
          messageAction="out"
          messageTime="20:40"
        />
        <CurrentConversationMessageBubble
          message="Salve carai"
          messageAction="in"
          messageTime="20:31"
        />
        <CurrentConversationMessageBubble
          message="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
          messageAction="out"
          messageTime="20:40"
        />
      </main>
    </div>
  )
}
