type Coordinate = [number, number];

interface Farm {
  id: string;
  name: string;
  fields: { id: string; name: string; location: Coordinate[]; position: Coordinate }[];
}
