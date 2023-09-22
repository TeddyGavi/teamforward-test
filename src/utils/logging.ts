const LOGGING_ENABLED = false

export const log = (...messages: string[]): void => {
  if (LOGGING_ENABLED) {
    console.log(messages)
  }
}
