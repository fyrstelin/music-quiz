import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { FC, Fragment, useMemo, useState } from "react";
import Decks from '../Decks'

export const Deck: FC<{ slug: string }> = ({ slug }) => {
  const deck = Decks[slug as keyof typeof Decks]
  const [currentTrack, setCurrentTrack] = useState<Track>()

  const grouped = useMemo(() => Object.entries(deck.tracks.reduce((acc, t) => {
    const bucket = (acc[t.album] = acc[t.album] ?? [])
    bucket.push(t)
    return acc
  }, {} as Record<string, Track[]>)).sort(([a], [b]) => a.localeCompare(b)), [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
          <IonTitle>{deck.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {grouped.map(([album, tracks], i) => <Fragment key={i}>
            <IonItemDivider color="light">
              <IonLabel>{album}</IonLabel>
              <IonLabel slot='end'>{tracks.length}</IonLabel>
            </IonItemDivider>
            {tracks.map((t, i) => (
              <IonItem key={i} onClick={() => setCurrentTrack(t)}>
                <IonLabel>
                  <h3>{t.title}</h3>
                  <p>{t.artist}</p>
                </IonLabel>
              </IonItem>
            ))}
          </Fragment>)}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
