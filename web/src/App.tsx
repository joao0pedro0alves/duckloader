import { useState } from 'react'
import { AxiosProgressEvent } from 'axios'
import { uniqueId } from 'lodash'
import { UploadedFile } from './@types/dto'

import { api } from './services/api'
import { FileList } from './components/FileList'
import { FilePicker } from './components/FilePicker'

export function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  function createFile(file: File): UploadedFile {
    const fileId = uniqueId()

    return {
      id: fileId,
      fileName: file.name,
      size: file.size,
      fileUrl: null,
      progress: 0,
      stage: 'progress',
      originalFile: file,
    }
  }

  function uploadProgress(event: AxiosProgressEvent, fileId: string) {
    if (event.total) {
      const progress = parseInt(
        String(Math.round((event.loaded * 100) / event.total)),
      )

      const stage = progress === 100 ? 'completed' : 'progress'

      setUploadedFiles((state) =>
        state.map((file) =>
          file.id !== fileId
            ? file
            : {
                ...file,
                progress,
                stage,
              },
        ),
      )
    }
  }

  async function uploadFile(fileId: string, file: File) {
    try {
      const uploadFormData = new FormData()
      uploadFormData.set('file', file)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        onUploadProgress: (event) => uploadProgress(event, fileId),
      })

      const fileUrl = uploadResponse.data.fileUrl

      setUploadedFiles((state) =>
        state.map((file) => (file.id !== fileId ? file : { ...file, fileUrl })),
      )
    } catch (error) {
      setUploadedFiles((state) =>
        state.map((file) =>
          file.id !== fileId ? file : { ...file, stage: 'uncompleted' },
        ),
      )
    }
  }

  function handleUploadFile(file: File) {
    const newFile = createFile(file)

    setUploadedFiles((state) => [newFile, ...state])

    uploadFile(newFile.id, file)
  }

  function handleRemoveFile(file: UploadedFile) {
    setUploadedFiles((state) => state.filter((item) => item.id !== file.id))
  }

  function handleReloadFile(file: UploadedFile) {
    uploadFile(file.id, file.originalFile)
  }

  return (
    <main className="mx-auto mb-16 mt-32 w-full max-w-[440px]">
      <FilePicker unUploadFile={handleUploadFile} />
      <FileList
        onRemoveFile={handleRemoveFile}
        onReloadFile={handleReloadFile}
        files={uploadedFiles}
      />
    </main>
  )
}
