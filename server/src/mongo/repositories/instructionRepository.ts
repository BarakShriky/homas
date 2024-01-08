import { RepositoryBase } from './repositoryBase';
import { MongoInstructionDocument } from '../../models/InstructionModel';
import InstructionSchema from '../schemas/instructionSchema';

export class InstructionRepository extends RepositoryBase<MongoInstructionDocument> {
    constructor() {
        super(InstructionSchema as any);
    }
}

Object.seal(InstructionRepository);
