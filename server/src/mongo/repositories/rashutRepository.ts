import { RepositoryBase } from './repositoryBase';
import { MongoRashutDocument } from '../../models/rashutModel';
import RashutSchema from '../schemas/rashutSchema';

export const generateInstructionID = () => `I${Math.random().toString(36).slice(2, 15).toUpperCase()}`;
export const generateRashutID = () => `R${Math.random().toString(36).slice(2, 15).toUpperCase()}`;
export const generateFileID = () => `F${Math.random().toString(36).slice(2, 20).toUpperCase()}`;

export class RashutRepository extends RepositoryBase<MongoRashutDocument> {
    constructor() {
        super(RashutSchema as any);
    }
}

Object.seal(RashutRepository);
