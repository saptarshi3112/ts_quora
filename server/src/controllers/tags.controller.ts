import {
  Request,
  Response
} from 'express';

const getAllTags = (req: Request, res: Response) => { }

const createTag = (req: Request, res: Response) => { }

const voteTag = (req: Request, res: Response) => { }

export const TagsController = {
  getAllTags,
  createTag,
  voteTag
}
