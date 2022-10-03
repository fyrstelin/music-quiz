import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/react";
import { settingsSharp } from "ionicons/icons";
import { useLinkFor } from "../cute-router";
import { DeckManager } from "../DeckManager/DeckManager";
import { useDeezerApi } from "../Deezer";
import { Settings } from "../Settings";
import { MultiPlayer } from "../Setup/MultiPlayer";
import { SinglePlayer } from "../Setup/SinglePlayer";
import './styles.css'

export const Home = () => (
  <IonPage className="home">
    <IonContent color="primary">
      <h1>Music Quiz</h1>

      <div className="mq-buttons">
        <IonButton
          expand="full"
          fill="solid"
          color="secondary"
          routerLink={useLinkFor(SinglePlayer, {})}
        >
          Single Player
        </IonButton>

        <IonButton
          disabled
          expand="full"
          fill="solid"
          color="secondary"
          routerLink={useLinkFor(MultiPlayer, {})}
        >
          Multiplayer Player
        </IonButton>
      </div>
      <div className='footer'>
        <IonButton fill="clear" color="light" routerLink={useLinkFor(Settings)}>
          <IonIcon icon={settingsSharp} />
        </IonButton>
      </div>
      <div className="version">{__APP_VERSION__}</div>
    </IonContent>
  </IonPage>
)
