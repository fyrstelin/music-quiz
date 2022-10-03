import shubidua from "./shu-bi-dua.json";
import dizzyMizzLizzy from "./dizzy-mizz-lizzy.json";
import kimLarsen from './kim-larsen.json'
import timChristensen from "./tim-christensen.json";
import kjukken from "./kjukken.json";
import bellami from "./bellami.json";
import bruceSpringsteen from "./bruce-springsteen.json";
import oneDirection from "./one-direction.json";
import abba from "./abba.json";

export const merge = (decks: ReadonlyArray<Deck>): Deck => ({
  name: decks.map(d => d.name).join(', '),
  tracks: decks.flatMap(d => d.tracks)
})

export default {
  'shu-bi-dua': shubidua,
  'dizzy-mizz-lizzy': dizzyMizzLizzy,
  'tim-christensen': timChristensen,
  'kim-larsen': kimLarsen,
  'kjukken': kjukken,
  'bellami': bellami,
  'the-boss': bruceSpringsteen,
  '1d': oneDirection,
  'abba': abba
} as Record<string, Deck>
