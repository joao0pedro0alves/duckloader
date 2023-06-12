import clsx from 'clsx'

interface ProgressBarProps {
  variant: 'progress' | 'completed' | 'uncompleted'
  progress: number
}

export function ProgressBar({ variant, progress }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx('h-2 flex-1 rounded-full bg-yellow-300', {
          'animate-pulse': variant === 'progress',
        })}
      >
        <div
          style={{ width: `${progress}%` }}
          className={clsx('h-2 rounded-full transition-all', {
            'bg-progress': variant === 'progress',
            'bg-green-500': variant === 'completed',
          })}
        />
      </div>
      <span
        className={clsx('text-xs', {
          'text-gray-200': variant === 'progress',
          'text-green-500': variant === 'completed',
          'text-red-500': variant === 'uncompleted',
        })}
      >
        {variant === 'uncompleted' ? 'Erro' : `${progress}%`}
      </span>
    </div>
  )
}
