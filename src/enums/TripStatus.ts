export enum TripStatus {
  // mostrado na tabela
  pending = 'PENDING',
  confirmed = 'CONFIRMED',
  canceled = 'CANCELED',
  inProgress = 'IN_PROGRESS',
  finished = 'FINISHED_CONFIRMED',

  // para mostrar em rotas
  unavailable = 'UNAVAILABLE',

  // startedUnconfirmed = 'STARTED_UNCONFIRMED',
  // started = 'STARTED_CONFIRMED',
  // finishedUnconfirmed = 'FINISHED_UNCONFIRMED',
}
