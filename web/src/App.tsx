import { useState, useEffect } from 'react'
import { AxiosProgressEvent } from 'axios'
import { produce } from 'immer'
import { UploadedFile } from './@types/dto'

import { api } from './services/api'
import { FileList } from './components/FileList'
import { FilePicker } from './components/FilePicker'

interface ResponseFile {
  id: string
  fileName: string
  originalName: string
  fileUrl: string
  size: number
}

export function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  useEffect(() => {
    async function loadFiles() {
      const response = await api.get('/files')
      const uploadedFiles = response.data.map(
        (file: ResponseFile): UploadedFile => ({
          id: file.id,
          fileName: file.originalName,
          fileUrl: file.fileUrl,
          size: file.size,
          progress: 100,
          stage: 'completed',
          originalFile: null,
        }),
      )

      setUploadedFiles(uploadedFiles)
    }

    loadFiles()
  }, [])

  function createFile(file: File): UploadedFile {
    const fileId = String(Math.random())

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

      setUploadedFiles(
        produce((draft) => {
          const index = draft.findIndex((item) => item.id === fileId)
          draft[index].progress = progress
          draft[index].stage = stage
        }),
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

      setUploadedFiles(
        produce((draft) => {
          const index = draft.findIndex((item) => item.id === fileId)
          draft[index].fileUrl = fileUrl
        }),
      )
    } catch (error) {
      setUploadedFiles(
        produce((draft) => {
          const index = draft.findIndex((item) => item.id === fileId)
          draft[index].stage = 'uncompleted'
        }),
      )
    }
  }

  function handleUploadFile(file: File) {
    const newFile = createFile(file)

    setUploadedFiles(
      produce((draft) => {
        draft.push(newFile)
      }),
    )

    uploadFile(newFile.id, file)
  }

  function handleRemoveFile(file: UploadedFile) {
    setUploadedFiles(
      produce((draft) => {
        const index = draft.findIndex((item) => item.id === file.id)
        draft.splice(index, 1)
      }),
    )
  }

  function handleReloadFile(file: UploadedFile) {
    if (file.originalFile) uploadFile(file.id, file.originalFile)
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
