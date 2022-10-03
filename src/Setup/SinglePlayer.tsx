import { IonBackButton, IonButtons, IonCheckbox, IonContent, IonFab, IonFabButton, IonFooter, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonRadio, IonRadioGroup, IonRange, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react"
import { Home } from "../Home"
import { playSharp } from 'ionicons/icons'
import { useState } from "react"
import { nanoid } from 'nanoid'
import { useLinkFor } from "../cute-router"
import { Expert } from "../Quiz"
import Decks from "../Decks"

const level = (lower: number, upper: number) => `${lower}-${upper}`
const levels = {
  easy: level(80, 100),
  normal: level(50, 100),
  expert: level(25, 75),
  insane: level(0, 50)
}

export const SinglePlayer = () => {
  const [decks, setDecks] = useState<ReadonlyArray<string>>([])
  const [level, setLevel] = useState(levels.normal)

  return <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>New Game</IonTitle>
        <IonButtons slot="start">
          <IonBackButton defaultHref={useLinkFor(Home)} text='' />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        <IonItemDivider color="light">
          Decks
        </IonItemDivider>
        {Object.entries(Decks).sort(([, a], [, b]) => a.name.localeCompare(b.name)).map(([slug, deck]) =>
          <IonItem key={slug}>
            <IonLabel>{deck.name}</IonLabel>
            <IonCheckbox slot='end' value={decks.includes(slug)} onIonChange={e => setDecks(
              e.detail.checked
                ? decks.concat(slug)
                : decks.filter(d => d !== slug)
            )} />
          </IonItem>
        )}
      </IonList>
      <IonItemDivider color="light">
        Level
      </IonItemDivider>
      <IonRadioGroup value={level} onIonChange={e => setLevel(e.detail.value)}>
        <IonItem>
          <IonLabel>
            Easy
            <p>Top 20%</p>
          </IonLabel>
          <IonRadio value={levels.easy} />
        </IonItem>
        <IonItem>
          <IonLabel>
            Normal
            <p>Top 50%</p>
          </IonLabel>
          <IonRadio value={levels.normal} />
        </IonItem>
        <IonItem>
          <IonLabel>
            Expert
            <p>Top 75% except top 25%</p>
          </IonLabel>
          <IonRadio value={levels.expert} />
        </IonItem>
        <IonItem>
          <IonLabel>
            Insane
            <p>Bottom 50%</p>
          </IonLabel>
          <IonRadio value={levels.insane} />
        </IonItem>
      </IonRadioGroup>

    </IonContent>

    <IonFooter>

      <IonItem
        color='secondary'
        routerLink={useLinkFor(Expert, { seed: nanoid(4), slugs: decks.join('+') + ',' + level })}
        disabled={decks?.length === 0}
        routerDirection="root"
        detail={false}
      >
        <IonLabel>Begin quiz</IonLabel>
        <IonIcon icon={playSharp} slot='end' />
      </IonItem>
    </IonFooter>
  </IonPage>
}
