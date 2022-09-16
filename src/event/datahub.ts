export interface DataRegisteredEvent {
  type: "DataRegistered";
  owner: string;
  name: string;
  commitment: string;
  version: number;
}
