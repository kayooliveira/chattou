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
      <form className="flex items-center justify-between rounded-full bg-app-backgroundLight p-3 px-6 text-app-text">
        <input
          className="bg-transparent text-xl outline-none placeholder:font-bold focus:outline-none"
          type="search"
          name="search"
          id="search"
          placeholder="Buscar..."
        />
        <IoMdSearch size="24" />
      </form>
      <section className="flex w-full flex-col items-center justify-center gap-3">
        <span className="flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-app-primary to-[#B66DFF] py-1.5 px-2.5 text-xs font-bold text-app-text">
          Ativo agora
          <span className="h-3 w-3 rounded-full border border-[#C093ED] bg-green-400" />
        </span>
        <div className="flex w-full items-center gap-1.5 overflow-x-scroll overflow-y-hidden scrollbar-none">
          <ActiveUserCard name="Teste" className="" profilePic={frame2} />
          <ActiveUserCard name="Teste" className="" profilePic={frame2} />
          <ActiveUserCard name="Teste" className="" profilePic={frame2} />
          <ActiveUserCard name="Teste" className="" profilePic={frame2} />
          <ActiveUserCard name="Teste" className="" profilePic={frame2} />
          <ActiveUserCard name="Teste" className="" profilePic={frame2} />
        </div>
      </section>
    </header>
  )
}
