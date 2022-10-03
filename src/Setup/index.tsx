import { Mount } from "../cute-router";
import { MultiPlayer } from "./MultiPlayer";
import { SinglePlayer } from "./SinglePlayer";


export const Setup = () => (
  <>
    <Mount component={SinglePlayer} at='single-player' />
    <Mount component={MultiPlayer} at='multi-player' />
  </>
)
