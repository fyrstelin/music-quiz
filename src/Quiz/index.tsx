import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonProgressBar, IonText, IonToolbar } from "@ionic/react"
import { FC, useEffect, useMemo, useReducer, useRef, useState } from "react"
import Decks, { merge } from '../Decks'
import seedrandom from 'seedrandom'
import { checkmarkSharp, closeSharp, playBackSharp, playSharp, playSkipBackSharp, playSkipForwardSharp, shareSocialOutline } from "ionicons/icons"
import { findBestMatch } from 'string-similarity'
import { useLinkFor } from "../cute-router"
import { nanoid } from "nanoid"
import { Audio } from "./Audio"

const timeout = (ms: number) => new Promise(r => setTimeout(r, ms))

type State = {
  round: number
  locked: boolean
  points: number
  fields: ReadonlyArray<{
    label: string
    value: string
    options: string[]
    key: keyof Track
    correct?: boolean
  }>
}

type Action = (state: State) => State
const Action = (action: Action) => action

const Initialize = (
  fields: State['fields']
) => Action(() => ({
  round: 0,
  points: 0,
  locked: false,
  fields
}))

const ClearFields = Action(state => ({
  ...state,
  fields: state.fields.map(f => ({
    ...f,
    value: '',
    correct: undefined
  }))
}))

const UpdateField = (index: number, value: string) => Action(state => ({
  ...state,
  fields: state.fields.map((f, i) => i === index
    ? {
      ...f,
      value
    } : f)
}))

const CorrectField = (index: number, correct: boolean) => Action(state => ({
  ...state,
  fields: state.fields.map((f, i) => i === index
    ? {
      ...f,
      correct
    } : f)
}))

const NextRound = Action(state => ({
  ...state,
  locked: false,
  points: state.points + (state.fields.filter(f => f.correct).length ** 2),
  fields: state.fields.map(f => ({
    ...f,
    value: '',
    correct: undefined
  })),
  round: state.round + 1
}))

const Lock = Action(state => ({
  ...state,
  locked: true
}))

const reducer = (state: State, action: Action) => action(state)



export const Expert: FC<{
  slugs: string
  seed: string
}> = ({ slugs, seed }) => {
  const deck = useMemo(() => {
    const [decks, slice] = slugs.split(',')
    const deck = merge(decks.split('+')
      .map(slug => Decks[slug])
      .filter(Boolean)
    )

    const [lower, upper] = slice.split('-')
      .map(x => parseFloat(x))

    const from = Math.round(deck.tracks.length * lower / 100)
    const to = Math.round(deck.tracks.length * upper / 100)

    const sorted = [...deck.tracks].sort((a, b) => a.rating - b.rating)

    return {
      ...deck,
      tracks: sorted
        .slice(from, to)
    }
  }, [slugs])

  const [state, execute] = useReducer(reducer, {
    points: 0,
    fields: [],
    locked: false,
    round: 0
  })

  const [loaded, setLoaded] = useState(0)
  const [loading, setLoading] = useState(0)
  const [ready, setReady] = useState(false)

  const newGame = useLinkFor(Expert, {
    seed: nanoid(4),
    slugs
  })

  const tracks = useMemo(() => {
    const random = seedrandom(seed)
    return deck.tracks
      .map(track => ({
        track,
        i: random()
      }))
      .sort((a, b) => a.i - b.i)
      .slice(0, 10)
      .map(x => x.track)
  }, [deck, seed])

  const target = tracks[state.round]

  useEffect(() => {
    setReady(false)
    setLoaded(0)
    setLoading(0)

    const pick = (label: string, key: keyof Track) => ({
      label,
      value: '',
      key,
      options: [...new Set(deck.tracks.map(t => t[key].toString()))]
    })

    execute(Initialize([
      pick('Artist', 'artist'),
      pick('Album', 'album'),
      pick('Track', 'title')
    ].filter(f => f.options.length > 1)))
  }, [deck, tracks])

  useEffect(() => {
    if (tracks.length === loaded) {
      const h = setTimeout(() => {
        setReady(true)
      }, 1000)

      return () => clearTimeout(h)
    } else {
      setReady(false)
    }
  }, [tracks, loaded])

  useEffect(() => {
    execute(ClearFields)
  }, [state.round])

  const guess = async () => {
    execute(Lock)

    await Promise.all(state.fields.map(async ({ value, options, key }, i) => {
      const match = findBestMatch(value.toLocaleLowerCase(), options).bestMatch

      execute(UpdateField(i, match.target))
      await timeout((i + 1) * 1000)

      execute(CorrectField(i, match.target === target[key]))
    }))

    await timeout(3000) // TODO play some music white boy!
    execute(NextRound)
  }

  const skip = async () => {
    execute(Lock)
    state.fields.forEach((f, i) => execute(CorrectField(i, false)))
    await timeout(3000) // TODO play some music white boy!
    execute(NextRound)
  }

  return <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonBackButton text='' defaultHref='/' />
        </IonButtons>
        <IonButtons slot='end'>
          <IonLabel>{state.points} points</IonLabel>

        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      {ready
        ? target
          ? <IonCard className="quiz-card">
            <IonCardHeader>
              <IonCardSubtitle>{deck.name}</IonCardSubtitle>
              <IonCardTitle>Round {state.round + 1}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                {state.fields.map((field, i) => (
                  <IonItem key={i}>
                    <IonLabel position="floating">
                      {field.label} {field.correct === false && `(${target[field.key]})`}
                    </IonLabel>
                    <IonInput
                      value={field.value}
                      onIonChange={e => execute(UpdateField(i, e.detail.value ?? ''))}
                      readonly={state.locked}
                      onKeyDown={e => {
                        if (field.value && e.key === 'Enter') {
                          const inputs = [...document.querySelectorAll('.quiz-card ion-input')] as HTMLIonInputElement[]
                          const next = inputs[inputs.indexOf(e.currentTarget) + 1]
                          if (next) {
                            next.setFocus()
                          } else {
                            guess()
                          }
                        }
                      }}
                    />
                    {field.correct !== undefined &&
                      <IonIcon
                        slot='end'
                        icon={field.correct ? checkmarkSharp : closeSharp}
                        color={field.correct ? 'success' : 'danger'}
                      />
                    }
                  </IonItem>))}
              </IonList>

              <div className="mq-buttons">
                <IonButton expand="full" disabled={state.locked || state.fields.some(x => !x.value)} onClick={guess}>
                  Guess
                </IonButton>
              </div>

            </IonCardContent>
          </IonCard>
          : <IonText>
            <h2>You got</h2>
            <h1>{state.points}/{tracks.length * (state.fields.length ** 2)} points</h1>
            <h2>Great job!</h2>

            <div className="mq-buttons">
              <IonButton routerLink={newGame} routerDirection='none'>Play again</IonButton>
            </div>
          </IonText>
        : <>
          <IonProgressBar
            value={loaded / tracks.length}
            buffer={loading / tracks.length}
          />
          <h1>Preparing Quiz</h1>
        </>
      }

    </IonContent>
    <IonFooter>
      <IonToolbar>
        <IonButtons style={{ justifyContent: 'center' }}>

          <IonButton disabled>
            <IonIcon icon={playSkipBackSharp} slot='icon-only' />
          </IonButton>
          {tracks.map((track, i) => <Audio
            key={i}
            track={track}
            onLoaded={() => setLoaded(x => x + 1)}
            onLoadStart={() => setLoading(x => x + 1)}
            current={ready && i === state.round}
            length={tracks.length - i}
            disabled={state.locked}
          />)}

          {target &&
            <IonButton onClick={skip} disabled={state.locked}>
              <IonIcon slot='icon-only' icon={playSkipForwardSharp} />
            </IonButton>
          }
        </IonButtons>
      </IonToolbar>
    </IonFooter>
  </IonPage >
}
