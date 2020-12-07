export interface TagSchema {
  _id: string;
  name: string;
  votes: number;
  voters: Array<any>;
  questions: Array<any>
}
