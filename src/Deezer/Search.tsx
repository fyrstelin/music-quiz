import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react"

export const Search = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
            <IonTitle>Search</IonTitle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar type="text" />
      </IonContent>
    </IonPage>
  )
}
