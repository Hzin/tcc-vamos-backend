export enum TripStatus {
  // mostrado na tabela
  pending = 'PENDING',
  confirmed = 'CONFIRMED',
  canceled = 'CANCELED',
  inProgress = 'IN_PROGRESS',
  finished = 'FINISHED_CONFIRMED',

  // para mostrar em rotas
  pendingGoingTrip = 'PENDING_GOING_TRIP',

  // startedUnconfirmed = 'STARTED_UNCONFIRMED',
  // started = 'STARTED_CONFIRMED',
  // finishedUnconfirmed = 'FINISHED_UNCONFIRMED',
}
