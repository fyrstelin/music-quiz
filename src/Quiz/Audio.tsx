import { IonButton, IonIcon } from '@ionic/react'
import { pauseSharp, playSharp } from 'ionicons/icons'
import { FC, useState, useEffect, useMemo } from 'react'

export const Audio: FC<{
  track: Track
  onLoadStart: () => void
  onLoaded: () => void
  current: boolean
  length: number
  disabled: boolean
}> = ({ track, onLoadStart, onLoaded, current, length, disabled }) => {
  const audioCtx = useMemo(() => {
    const ctx = new AudioContext()
    return ctx
  }, [])

  const [state, setState] = useState<'paused' | 'playing'>('paused')
  const [buffer, setBuffer] = useState<ArrayBuffer>()
  const [bufferSource, setBufferSource] = useState<AudioBufferSourceNode>()
  const [remaining, setRemaining] = useState(length)
  const [stopAt, setStopAt] = useState<Date>()

  const initialize = async (buffer: ArrayBuffer) => {
    const audio = await audioCtx.decodeAudioData(buffer.slice(0))
    const src = audioCtx.createBufferSource()
    src.buffer = audio
    setBufferSource(src)
  }

  useEffect(() => {
    if (bufferSource) {

      bufferSource.connect(audioCtx.destination)
      bufferSource.start(0, 0, length)
      audioCtx.resume()
      setState('playing')

      const d = new Date()
      d.setSeconds(d.getSeconds() + length)
      setStopAt(new Date())
      const startedAt = Date.now()
      const handle = setTimeout(() => {
        bufferSource.stop()
        bufferSource.disconnect()
        console.log('stopping after start')
        setBufferSource(undefined)
      }, length * 1000)


      return () => {
        clearTimeout(handle)
        bufferSource.stop()
        bufferSource.disconnect()
        setRemaining(Date.now() - startedAt)
      }
    } else {
      setState('paused')
    }
  }, [bufferSource, length, audioCtx])



  useEffect(() => {
    fetch(track.url)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        setBuffer(buffer)
        return buffer
      })
      .then(() => onLoaded())
      .catch(err => console.error(err))

    onLoadStart()
  }, [track])

  useEffect(() => {
    if (!buffer) return

    const teardown = [] as Array<() => void>
    console.log({ state })
    switch (state) {
      case 'playing':
        if (bufferSource) {
          audioCtx.resume()
          const h = setTimeout(() => {
            console.log('stopping after continue')
            setBufferSource(undefined)
          }, remaining)

          teardown.push(() => clearTimeout(h))
        } else {
          initialize(buffer)
        }
        break
      case 'paused':
        if (audioCtx.state === 'suspended') {
          return
        }
        audioCtx.suspend()
        break
    }

    return () => teardown.forEach(fn => fn())
  }, [state])


  const toogleState = () => {
    setState(s => s === 'playing' ? 'paused' : 'playing')
  }

  return (
    <>
      {current && <IonButton onClick={toogleState} disabled={disabled}>
        <IonIcon slot='icon-only' icon={state === 'paused' ? playSharp : pauseSharp} />
      </IonButton>}
    </>
  )
}
