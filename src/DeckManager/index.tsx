import { Mount } from "../cute-router";
import { Deck } from "./Deck";
import { DeckManager } from './DeckManager'

export const Decks = () => {
  return <>
    <Mount component={DeckManager} at='' />
    <Mount component={Deck} at=':slug' />
  </>
}
