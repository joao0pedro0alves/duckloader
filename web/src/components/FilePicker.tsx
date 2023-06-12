import { CloudArrowUp } from 'phosphor-react'
import { ChangeEvent } from 'react'

interface FilePickerProps {
  unUploadFile: (file: File) => void
}

export function FilePicker({ unUploadFile }: FilePickerProps) {
  function handleChangeFile(event: ChangeEvent<HTMLInputElement>) {
    const hasFilesSelected = event.target.files

    if (hasFilesSelected) {
      const file = event.target.files?.[0]
      if (file) unUploadFile(file)
    }
  }

  return (
    <>
      <label
        htmlFor="upload"
        className="group mb-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-purple-300 bg-purple-100 p-8 pt-7 transition-colors hover:bg-purple-200"
      >
        <div className="mb-3">
          <CloudArrowUp
            className="text-purple-500 group-hover:animate-bounce"
            size={45}
          />
        </div>

        <span className="text-md font-bold text-purple-600">
          Importe seus arquivos
        </span>
        <span className="text-sm text-gray-700">
          Arraste ou clique para fazer upload
        </span>
      </label>

      <input
        className="hidden"
        type="file"
        name="upload"
        id="upload"
        accept="image/*"
        onChange={handleChangeFile}
      />
    </>
  )
}
