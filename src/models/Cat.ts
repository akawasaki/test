export interface Cat {
  name: string;
  id: string;
  age?: number;
  color: Color;
}

export enum Color {
  Black = 'black',
  White = 'white',
  Brawn = 'brawn',
}
