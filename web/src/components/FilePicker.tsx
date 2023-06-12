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
      <label htmlFor='upload' className="p-8 pt-7 bg-purple-100 border border-dashed border-purple-300 rounded-lg mb-5 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-200 transition-colors">
        <div className='mb-3'>
          <CloudArrowUp className='text-purple-500' size={45} />
        </div>

        <span className='text-purple-600 font-bold text-md'>Importe seus arquivos</span>
        <span className='text-gray-700 text-sm'>Arraste ou clique para fazer upload</span>
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