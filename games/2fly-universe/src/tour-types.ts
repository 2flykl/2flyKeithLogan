export interface TourStop {
  id: string;
  name: string;
  subtitle?: string;
  objectId?: string;
  galaxyId?: string;
  kind?: string;
  live?: boolean;
  pos: { x: number; y: number; z: number };
}
