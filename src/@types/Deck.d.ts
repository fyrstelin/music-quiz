type Track = {
  url: string
  artist: string
  album: string
  title: string
  rating: number
}

type Deck = Readonly<{
  name: string
  tracks: ReadonlyArray<Track>
}>
