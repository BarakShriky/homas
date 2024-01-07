import ImageSchema from '../schemas/imageSchema';
import { RepositoryBase } from './repositoryBase';
import { MongoImageDocument } from '../../models/imageModel';

export class ImageRepository extends RepositoryBase<MongoImageDocument> {
    constructor() {
        super(ImageSchema as any);
    }
}

Object.seal(ImageRepository);
