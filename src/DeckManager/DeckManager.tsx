import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { FC } from "react";
import { useLinkFor } from "../cute-router";
import Decks from '../Decks'
import { Deck } from "./Deck";

export const DeckManager: FC = () => {
  return <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>Deck manager</IonTitle>
        <IonButtons slot='start'>
          <IonBackButton defaultHref="/" />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
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
}
