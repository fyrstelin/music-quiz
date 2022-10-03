import { IonApp } from "@ionic/react"
import { Home } from "./Home"
import { Setup } from "./Setup"
import { Expert } from "./Quiz"
import { CuteIonRouter, Mount } from "./cute-router"
import { DeezerApi } from "./Deezer"
import { Decks } from "./DeckManager"
import { Settings } from "./Settings"
import { Search } from "./Deezer/Search"

export const App = () => (
  <DeezerApi>
    <IonApp>
      <CuteIonRouter>
        <Mount component={Home} at='' />
        <Mount at='decks'>
          <Decks />
        </Mount>
        <Mount at='setup'>
          <Setup />
        </Mount>
        <Mount component={Expert} at='quiz/expert/:slugs/:seed' />
        <Mount component={Settings} at='settings' />
        <Mount component={Search} at='search' />
      </CuteIonRouter>
    </IonApp>
  </DeezerApi>
)

