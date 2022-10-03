import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import { searchSharp } from "ionicons/icons"
import { useLinkFor } from "../cute-router"
import { Deck } from "../DeckManager/Deck"
import Decks from "../Decks"
import { useDeezerApi } from "../Deezer"
import { Search } from "../Deezer/Search"

export const Settings = () => {
  const { available } = useDeezerApi()
  const searchLink = useLinkFor(Search)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
          <IonButtons slot='end'>
            {available &&
              <IonButton routerLink={searchLink}>
                <IonIcon slot="icon-only" icon={searchSharp} />
              </IonButton>
            }
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItemDivider>
            <IonLabel>Decks</IonLabel>
          </IonItemDivider>
          {Object.entries(Decks)
            .sort(([, a], [, b]) => a.name.localeCompare(b.name))
            .map(([slug, { name, tracks }]) => (
              <IonItem key={slug} routerLink={useLinkFor(Deck, { slug })}>
                <IonLabel>{name}</IonLabel>
                <IonLabel slot='end' color="primary">{tracks.length}</IonLabel>
              </IonItem>
            )
            )}
        </IonList>
      </IonContent>
    </IonPage>
  )
}
