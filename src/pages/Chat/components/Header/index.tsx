import { collection, onSnapshot } from 'firebase/firestore'
import { database } from 'lib/firebase'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { IoMdOptions, IoMdSearch } from 'react-icons/io'
import { useAuthStore, User } from 'store/auth'

import { ActiveUserCard } from '../ActiveUserCard'

/**
 * @version 0.0.2
 *
 * @author Kayo Oliveira <contato@kayooliveira.com>
 *
 * @description Cabeçalho da aplicação contendo formulário para busca de usuários, configurações da conta de usuário e usuários ativos.
 *
 * @return ReactElement
 */

export function Header(): React.ReactElement {
  const [activeUsers, setActiveUsers] = useState<User[]>([])
  const [searchUserInput, setSearchUserInput] = useState<string>('')
  const user = useAuthStore(state => state.user)

  useEffect(() => {
    if (user) {
      const controller = new AbortController()
      const getUsers = async () => {
        // ? Ao carregar o componente, busca por todos os usuários cadastrados e guarda os dados dos mesmos no estado do componente.
        const usersRef = collection(database, 'users')
        onSnapshot(usersRef, usersSnap => {
          usersSnap.forEach(udoc => {
            if (udoc.exists()) {
              if (udoc.id === user.id) return // ? Verifica se o usuário iterado no momento tem o ID igual ao usuário ativo, se sim, pula esta iteração.
              // ? Verifica se a doc existe.
              const udata = udoc.data() as Omit<User, 'id'>

              if (udata) {
                // ? Se existir dados na doc, adicione ao estado activeUsers.
                setActiveUsers(state => {
                  const userData = {
                    ...udata,
                    id: udoc.id
                  }
                  if (state) {
                    // ? Se o usuário já existir no estado, retorna apenas o estado sem alterá-lo.
                    if (state.find(u => u.id === udoc.id)) {
                      return state
                    }
                    // ? Se não existir, adiciona o mesmo ao estado.
                    return [...state, userData]
                  }
                  return [
                    // ? Caso não haja usuários ao estado, adiciona um novo usuário a ele.
                    userData
                  ]
                })
              }
            }
          })
        })
      }
      getUsers()
      return () => controller.abort()
    }
  }, [user])

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Função responsável por buscar os usuários no database baseado no que o usuário digitou.
   *
   * @param e
   *
   * @return void
   */

  function handleSearchUsers(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('Buscando usuário...')
  }

  /**
   * @version 0.0.1
   *
   * @author Kayo Oliveira <contato@kayooliveira.com>
   *
   * @description Função que gerencia o estado e o valor do input de busca de usuários.
   *
   * @param e
   *
   * @return void
   */
  function handleChangeSearchInput(e: ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value
    if (value.trim().length > 0) {
      setSearchUserInput(value)
    }
  }

  return (
    <header className="flex w-full flex-col items-center justify-center gap-6 font-brand font-bold leading-none text-app-light">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Mensagens</h1>
        <button
          type="button"
          className="transition-colors hover:text-app-primary"
        >
          <IoMdOptions size="24" />
        </button>
      </div>
      <form
        onSubmit={handleSearchUsers}
        className="flex w-full items-center justify-between rounded-full border border-transparent bg-app-backgroundLight p-1 px-3 text-app-text transition-all focus-within:border-app-light/20 focus-within:shadow-md"
      >
        <input
          className="bg-transparent text-xl outline-none placeholder:font-bold focus:text-app-primary focus:outline-none focus:placeholder:text-app-primary"
          type="search"
          value={searchUserInput}
          onChange={handleChangeSearchInput}
          name="search"
          id="search"
          placeholder="Buscar..."
        />
        <button
          type="button"
          className="rounded-full bg-app-primary p-2 outline-none focus:outline-app-primaryDark/40"
        >
          <IoMdSearch size="24" />
        </button>
      </form>
      <section className="flex w-full flex-col items-center justify-center gap-3">
        <span className="flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-app-primary to-[#B66DFF] py-1.5 px-2.5 text-xs font-bold text-app-text">
          Ativo agora
          <span className="h-3 w-3 rounded-full border border-[#C093ED] bg-green-400" />
        </span>
        <div className="mb-4 flex w-full items-center gap-3 overflow-x-scroll overflow-y-hidden scrollbar-none">
          {activeUsers &&
            activeUsers.map(activeUser => (
              <ActiveUserCard
                key={activeUser.id}
                id={activeUser.id}
                name={activeUser.name}
                avatar={activeUser.avatar || ''}
              />
            ))}
        </div>
      </section>
    </header>
  )
}
