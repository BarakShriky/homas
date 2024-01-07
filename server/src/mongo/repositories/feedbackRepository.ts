import { RepositoryBase } from './repositoryBase';
import { MongoFeedbackDocument } from '../../models/feedbackModel';
import FeedbackSchema from '../schemas/feedbackSchema';

export class FeedbackRepository extends RepositoryBase<MongoFeedbackDocument> {
    constructor() {
        super(FeedbackSchema as any);
    }
}

Object.seal(FeedbackRepository);
