export interface TagSchema {
  _id: string;
  name: string;
  votes: number;
  voters: any[];
  questions: any[]
}
