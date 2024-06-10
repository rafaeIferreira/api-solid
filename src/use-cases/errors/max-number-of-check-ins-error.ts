export class MaxNumberCheckInsError extends Error {
  constructor() {
    super('Max number of checkins reached.')
  }
}
