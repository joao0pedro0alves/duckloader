export type StageType = 'completed' | 'uncompleted' | 'progress'

export interface UploadedFile {
  id: string
  fileName: string
  fileUrl: string | null

  size: number
  progress: number
  stage: StageType

  originalFile: File
}
