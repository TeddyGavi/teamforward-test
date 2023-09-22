const LOGGING_ENABLED = false

export const log = (...messages): void => {
  if (LOGGING_ENABLED) {
    console.log(messages)
  }
}
