import classNames from 'classnames'

interface CurrentConversationMessageBubbleProps {
  messageAction: 'in' | 'out'
  message: string
  messageTime: string
}

export function CurrentConversationMessageBubble({
  messageAction,
  message,
  messageTime
}: CurrentConversationMessageBubbleProps) {
  return (
    <div
      className={classNames('flex w-full items-center gap-2 p-2', {
        'justify-end': messageAction === 'out',
        'justify-start': messageAction === 'in'
      })}
    >
      <p
        className={classNames(
          'w-fit max-w-[20rem] gap-6 whitespace-pre-wrap break-words rounded-xl py-2 px-4 text-lg leading-[23px] text-app-text after:absolute after:-right-2 after:top-0 after:h-3 after:w-4 after:rounded',
          {
            'rounded-tr-none bg-gradient-to-l from-app-primaryDark to-app-primary':
              messageAction === 'out',
            'rounded-tl-none bg-app-backgroundLight': messageAction === 'in'
          }
        )}
      >
        {message}

        <span className="relative bottom-0 float-right mt-2 pl-6 text-xs leading-none text-app-light">
          {messageTime}
        </span>
      </p>
    </div>
  )
}
