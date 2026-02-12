export interface EventInterface {
  _id: string;
  title: string;
  date: string;
  hourStart?: string;
  hourEnd?: string;
  comment?: string;
  vehicleId?: string;
}