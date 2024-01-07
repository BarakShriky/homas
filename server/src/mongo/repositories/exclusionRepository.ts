import { RepositoryBase } from './repositoryBase';
import { MongoFeedbackDocument } from '../../models/feedbackModel';
import ExclusionSchema from '../schemas/exclusionSchema';

export class ExclusionRepository extends RepositoryBase<MongoFeedbackDocument> {
    constructor() {
        super(ExclusionSchema as any);
    }
}

Object.seal(ExclusionRepository);
