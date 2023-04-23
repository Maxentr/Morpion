import { ServerErrorMessage } from "shared-utils"

const ERROR_MESSAGE = {
  "game-not-found": "La partie n'existe pas",
  "game-is-full": "La partie est déjà pleine",
  "game-is-already-started": "La partie a déjà commencé",
}


export const getErrorMessage = (error: ServerErrorMessage) => {
  if (error in ERROR_MESSAGE) {
    return ERROR_MESSAGE[error] 
  }
  return error
}
