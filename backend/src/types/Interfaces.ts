export interface IGif
{
    uuid: string
    path: string
    creationDate: Date
    featured: boolean
    processing: boolean
}

export interface IFile
{
    fileName: string
    data: Buffer
}
