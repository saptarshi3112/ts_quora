import { Request, Response } from 'express';

import { statusMessage } from '../config';
import { UtilityHelper } from '../helpers';
import { Tag } from '../models';

import { TagSchema } from '../schema/tag.schema';

/**
 * Fetch all tags
 * @param req
 * @param res
 * @returns {Promise}
 */
const getAllTags = async (req: Request, res: Response): Promise<any> => {
  try {
    const { limit }: number | any = req.query;
    let tags = [];
    if (limit)
      tags = await Tag.find().limit(limit);
    else
      tags = await Tag.find();
    return res.json({
      ...statusMessage.TAG200,
      data: { tags }
    });
  } catch (ex: any) {
    return res.json(UtilityHelper.errorHandler(ex));
  }
}

/**
 * Search tags by their names
 * @param req
 * @param res
 * @returns {Promise}
 */
const searchTagsByName = async (req: Request, res: Response): Promise<any> => {
  try {
    const { search_term } = req.body;
    const tags = await Tag.find({ 'name': { '$regex': search_term, '$options': 'im' } }).lean();
    return res.json({
      ...statusMessage.TAG200,
      data: { tags }
    });
  } catch (ex: any) {
    return res.json(UtilityHelper.errorHandler(ex));
  }
}

/**
 * Create a new tag
 * @param req
 * @param res
 * @returns {Promise}
 */
const createTag = async (req: Request, res: Response): Promise<any> => {
  try {
    const tag: TagSchema = req.body;
    const tagObject = await Tag.findOne({ name: tag.name }).lean();
    if (!tagObject) {
      const newTag = new Tag({
        name: tag.name
      });
      await newTag.save();
      return res.json(statusMessage.TAG201);
    } else {
      return res.json(statusMessage.TAG409);
    }
  } catch (ex: any) {
    return res.json(UtilityHelper.errorHandler(ex));
  }
}

/**
 * Vote a tag
 * @param req
 * @param res
 * @returns {Promise}
 */
const voteTag = async (req: Request, res: Response): Promise<any> => {
  try {
    const { tag_id, user_id }: object | any = req.body;
    const tag: any = await Tag.findById(tag_id);
    if (tag) {
      tag.votes += 1;
      tag.voters.push(user_id);
      await tag.save();
      return res.json(statusMessage.TAGVOTE201)
    } else {
      return res.json(statusMessage.TAG404);
    }
  } catch (ex: any) {
    return res.json(UtilityHelper.errorHandler(ex));
  }
}

export const TagsController = {
  getAllTags,
  searchTagsByName,
  createTag,
  voteTag
}
