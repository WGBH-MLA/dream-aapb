import { PBCoreDescriptionDocument } from "./pbcore"

type Page = {
    meta: {
        slug: string
    }
    title: string
    cover_image?: {
        full_url: string
    }
}

export type Exhibit = Page & {
    body: object[]
    introduction?: string
    tags?: string[]
    url?: string
    key?: string
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
