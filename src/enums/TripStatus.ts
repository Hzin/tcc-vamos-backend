export enum TripStatus {
  pending = 'PENDING',
  confirmed = 'CONFIRMED',
  canceled = 'CANCELED',

  startedUnconfirmed = 'STARTED_UNCONFIRMED',
  started = 'STARTED_CONFIRMED',

  inProgress = 'IN_PROGRESS',

  finishedUnconfirmed = 'FINISHED_UNCONFIRMED',
  finished = 'FINISHED_CONFIRMED'
}
