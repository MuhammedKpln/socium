interface IExplicitContent {
  filter_enabled: boolean
  filter_locked: boolean
}

interface IExternalUrls {
  spotify: string
}

interface IFollowers {
  href?: any
  total: number
}

export interface ISpotifyUserResponse {
  country: string
  display_name: string
  email: string
  explicit_content: IExplicitContent
  external_urls: IExternalUrls
  followers: IFollowers
  href: string
  id: string
  images: any[]
  product: string
  type: string
}

interface ExternalUrls {
  spotify: string
}

interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

interface ExternalUrls2 {
  spotify: string
}

interface Image {
  height: number
  url: string
  width: number
}

interface Album {
  album_type: string
  artists: Artist[]
  available_markets: string[]
  external_urls: ExternalUrls2
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}

interface ExternalUrls3 {
  spotify: string
}

interface Artist2 {
  external_urls: ExternalUrls3
  href: string
  id: string
  name: string
  type: string
  uri: string
}

interface ExternalIds {
  isrc: string
}

interface ExternalUrls4 {
  spotify: string
}

interface Item {
  album: Album
  artists: Artist2[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIds
  external_urls: ExternalUrls4
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}

interface Disallows {
  resuming: boolean
  skipping_prev: boolean
}

interface Actions {
  disallows: Disallows
}

export interface ISpotifyCurrentTrack {
  timestamp: number
  context?: any
  progress_ms: number
  item: Item
  currently_playing_type: string
  actions: Actions
  is_playing: boolean
}

export interface ISavedCurrentTrack {
  songName: string
  artistName: string
  image: string
}

export interface ICurrentTrack {
  songName: string
  artistName: string
  imageUrl: string
}
