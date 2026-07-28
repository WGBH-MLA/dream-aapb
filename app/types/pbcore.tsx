export type MediaType = 'Moving Image' | 'Sound'

export type Guid = `cpb-aacip${'-' | '_' | '/'}${string}`

export type PBCore = {
  pbcoreDescriptionDocument: PBCoreDescriptionDocument
}
export type PBCoreDescriptionDocument = {
  pbcoreInstantiation: PBCoreInstantiation | PBCoreInstantiation[]
  'xsi:schemaLocation': string
  pbcoreIdentifier: PBCoreIdentifier[]
  pbcoreTitle: PBCoreTitle | PBCoreTitle[]
  pbcoreDescription: string | PBCoreDescription[]
  pbcoreAnnotation: PBCoreAnnotation[]
  pbcoreCreator: PBCoreCreator[]
  pbcoreSubject: PBCoreSubject[]
  pbcoreGenre: PBCoreGenre
  pbcoreRelation: PBCoreRelation
  pbcoreCoverage: PBCoreCoverage
  pbcoreContributor: PBCoreContributor[]
  pbcorePublisher: PBCorePublisher
  pbcoreRightsSummary: PBCoreRightsSummary
}

export type PBCoreDescription = {
  descriptionType: string
  text: string
}

export type PBCoreInstantiation = {
  instantiationPhysical: string
  instantiationLocation: string
  instantiationMediaType: MediaType | 'other'
  instantiationGenerations: string
  instantiationDuration: string
  instantiationTracks: string
  instantiationAnnotation: PBCoreAnnotation[]
  instantiationIdentifier: PBCoreIdentifier[]
  instantiationDate: PBCoreDate
  instantiationDimensions: string
  instantiationDigital: string
  instantiationStandard: string
  instantiationColors: string
  instantiationEssenceTrack: PBCoreEssenceTrack[]
}

export type PBCoreTitle = {
  titleType: string
  text: string
}

export type PBCoreAnnotation = {
  annotationType: string
  text: string
}

export type PBCoreIdentifier = {
  source: string
  text: string
}

export type PBCoreCreator = {
  creator: string | PBCoreCreatorRef
  creatorRole: string
}

export type PBCoreSubject = {
  subjectType: string
  text: string
}

export type PBCoreCreatorRef = {
  ref: string
  text: string
}

export type PBCoreGenre = {
  source: string
  annotation: string
  text: string
}

export type PBCoreRelation = {
  pbcoreRelationType: PBCoreIdentifier
  pbcoreRelationIdentifier: string
}

export type PBCoreCoverage = {
  coverage: string
  coverageType: string
}

export type PBCoreContributor = {
  contributor: string
  contributorRole: string
}

export type PBCorePublisher = {
  publisher: string
  publisherRole: string
}

export type PBCoreRightsSummary = {
  rightsSummary: string
}

export type PBCoreDate = {
  dateType: string
  text: string
}

export type PBCoreEssenceTrack = {
  essenceTrackType: 'audio' | 'video' | 'other'
  essenceTrackIdentifier: string
  essenceTrackEncoding: string
  essenceTrackSamplingRate: string
  essenceTrackBitDepth: string
  essenceTrackTimeStart: string
  essenceTrackDuration: string
  essenceTrackAspectRatio: string
}
