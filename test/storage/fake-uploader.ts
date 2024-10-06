import { Uploader, UploaderParams } from '@/domain/application/storage/uploader'
import { randomUUID } from 'crypto'

type Upload = {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({
    fileName,
    body,
    fileType,
  }: UploaderParams): Promise<{ url: string }> {
    const url = randomUUID() + body + fileType

    this.uploads.push({
      fileName,
      url,
    })

    return { url }
  }
}
