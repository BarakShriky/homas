import CategorySchema from '../schemas/categorySchema';
import { RepositoryBase } from './repositoryBase';
import { MongoCategoryDocument } from '../../models/categoryModel';

export class CategoryRepository extends RepositoryBase<MongoCategoryDocument> {
    constructor() {
        super(CategorySchema as any);
    }
}

Object.seal(CategoryRepository);
