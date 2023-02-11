import frame2 from 'assets/img/current-active/Frame2.png'
import { IoMdOptions, IoMdSearch } from 'react-icons/io'

import { ActiveUserCard } from '../ActiveUserCard'

export function Header() {
  return (
    <header className="flex flex-col items-center justify-center gap-6 font-brand font-bold leading-none text-app-light">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Mensagens</h1>
        <IoMdOptions size="24" />
      </div>
      <form className="flex items-center justify-between rounded-full border border-transparent bg-app-backgroundLight p-3 px-6 text-app-text transition-all focus-within:border-app-light/20 focus-within:shadow-md">
        <input
          className="bg-transparent text-xl outline-none placeholder:font-bold focus:text-app-primary focus:outline-none focus:placeholder:text-app-primary"
          type="search"
          name="search"
          id="search"
          placeholder="Buscar..."
        />
        <button type="button" className="outline-none focus:text-app-primary">
          <IoMdSearch size="24" />
        </button>
      </form>
      <section className="flex w-full flex-col items-center justify-center gap-3">
        <span className="flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-app-primary to-[#B66DFF] py-1.5 px-2.5 text-xs font-bold text-app-text">
          Ativo agora
          <span className="h-3 w-3 rounded-full border border-[#C093ED] bg-green-400" />
        </span>
        <div className="mb-4 flex w-full items-center gap-3 overflow-x-scroll overflow-y-hidden scrollbar-none">
          <ActiveUserCard
            name="Melancia"
            profilePic="https://pps.whatsapp.net/v/t61.24694-24/324774673_143469341868986_3167121837011671739_n.jpg?ccb=11-4&oh=01_AdTYQNpBAgITU6pegcyB_-TX7Q9uq8vvIP8ieCsI1BlXBQ&oe=63F29C1E"
          />
          <ActiveUserCard
            name="Kauã Robertinho"
            profilePic="https://pps.whatsapp.net/v/t61.24694-24/319740802_564840365161633_8442839346714292673_n.jpg?ccb=11-4&oh=01_AdRX63uJINmd-MbnZmsPau1SkcjgbZW1hMkdSWlSJ75cSA&oe=63F2C0D5"
          />
          <ActiveUserCard
            name="Kayozin"
            profilePic="https://pps.whatsapp.net/v/t61.24694-24/317043946_3611019772517859_5951200302963342037_n.jpg?ccb=11-4&oh=01_AdRSniWf0H1bzOAOgsTT9e3y-sGsS3aZHuv0jfJ3KjUJYA&oe=63F2BE8B"
          />
          <ActiveUserCard
            name="Savio"
            className=""
            profilePic="https://pps.whatsapp.net/v/t61.24694-24/325793715_962615208055108_9002868011396268687_n.jpg?ccb=11-4&oh=01_AdTEIJ8jkRQiIq3JsP4K7o8PeUfGVIsA77vFPKjoAk3xNA&oe=63F2C27D"
          />
          <ActiveUserCard name="Teste" className="" profilePic={frame2} />
          <ActiveUserCard name="Teste" className="" profilePic={frame2} />
        </div>
      </section>
    </header>
  )
}
