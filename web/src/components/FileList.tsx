import clsx from 'clsx'
import { filesize } from 'filesize'
import { File, X, ArrowCounterClockwise as Retry } from 'phosphor-react'
import { UploadedFile } from '../@types/dto'
import { ProgressBar } from './ProgressBar'

interface FileListProps {
  files: UploadedFile[]
  onRemoveFile: (file: UploadedFile) => void
  onReloadFile: (file: UploadedFile) => void
}

export function FileList({ files, onRemoveFile, onReloadFile }: FileListProps) {
  return (
    <section className="flex flex-col gap-3">
      {files.map((file) => {
        const inProgress = file.stage === 'progress'
        const isCompleted = file.stage === 'completed'
        const isUncompleted = file.stage === 'uncompleted'

        const loadedSize = (file.size * file.progress) / 100
        const formattedLoadedSize = String(filesize(loadedSize))
        const formattedSize = String(filesize(file.size))

        return (
          <div
            key={file.id}
            className="flex items-center gap-3 rounded-lg bg-white p-2 shadow-fileShadow"
          >
            <a
              href={file.fileUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx('rounded px-3 py-4', {
                'bg-purple-200 text-purple-400': inProgress,
                'bg-green-200 text-green-500': isCompleted,
                'bg-red-200 text-red-500': isUncompleted,
              })}
            >
              <File size={24} weight="fill" />
            </a>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{file.fileName}</span>

                {inProgress && (
                  <button onClick={() => onRemoveFile(file)}>
                    <X className="text-purple-500" size={20} />
                  </button>
                )}

                {isUncompleted && (
                  <button onClick={() => onReloadFile(file)}>
                    <Retry className="text-purple-500" size={20} />
                  </button>
                )}
              </div>

              <span className="mb-1 block text-xs text-gray-800">
                {inProgress
                  ? `${formattedLoadedSize} / ${formattedSize}`
                  : formattedSize}
              </span>

              <ProgressBar progress={file.progress} variant={file.stage} />
            </div>
          </div>
        )
      })}
    </section>
  )
}
