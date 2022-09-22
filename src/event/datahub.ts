export interface DataRegisteredEvent {
  type: "DataRegistered";
  owner: string;
  name: string;
  index: number;
  commitment: string;
}
