export interface TourStop {
  id: string;
  name: string;
  subtitle?: string;
  objectId?: string;
  pos: { x: number; y: number; z: number };
}
