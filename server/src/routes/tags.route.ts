import { Router } from 'express';

import { validateUser } from '../middleware';
import { TagsController } from '../controllers';

const router = Router();

// get request
router.get('/getAllTags', validateUser, TagsController.getAllTags);

// post request
router.post('/addNewTag', validateUser, TagsController.createTag);
router.post('/voteTag', validateUser, TagsController.voteTag);
router.post('/searchTagsByName', validateUser, TagsController.searchTagsByName);

export default router;
