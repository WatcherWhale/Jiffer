export interface IGif
{
    id: string
    file: string
    expires: number
    processing: boolean
}

export interface IFile
{
    fileName: string
    data: Buffer
}
