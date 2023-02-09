import {
  IoMdCamera,
  IoMdOptions,
  IoMdChatbubbles,
  IoMdCall
} from 'react-icons/io'

export function Footer() {
  return (
    <footer className="fixed bottom-4 left-1/2 flex h-fit w-[calc(100%_-_4rem)] -translate-x-1/2 translate-y-0 items-center justify-center gap-8 rounded-full bg-app-backgroundLight px-8 py-4 text-app-light shadow-md shadow-black drop-shadow-2xl">
      <button className="transition-colors hover:text-app-primary">
        <IoMdChatbubbles size="30" />
      </button>
      <button className="transition-colors hover:text-app-primary">
        <IoMdCall size="30" />
      </button>
      <button className="transition-colors hover:text-app-primary">
        <IoMdCamera size="30" />
      </button>
      <button className="transition-colors hover:text-app-primary">
        <IoMdOptions size="30" />
      </button>
    </footer>
  )
}
