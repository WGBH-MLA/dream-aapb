import { PBCoreDescriptionDocument } from "./pbcore"

type Image = {
    full_url: string
    url: string
    width: number
    height: number
    alt?: string
}

type Author = {
    id: number
    name: string
    image?: Image
    bio?: string
}

type Page = {
    meta: {
        slug: string
    }
    title: string
    cover_image?: Image
    cover_thumb?: Image
}

export type Exhibit = Page & {
    body: object[]
    introduction?: string
    tags?: string[]
    url?: string
    key?: string
    authors?: Author[]
}

export type Record = {
    guid: string
}

export type AAPBRecord = Record & {
    title?: string | undefined
    thumbnail?: string | undefined
    desc?: string | undefined
    mediaType?: string | undefined
    url?: string | undefined
    pbcore?: PBCoreDescriptionDocument | undefined
}
