import { RepositoryBase } from './repositoryBase';
import { MongoRoleDocument } from '../../models/roleModel';
import RoleSchema from '../schemas/roleSchema';

export class RoleRepository extends RepositoryBase<MongoRoleDocument> {
    constructor() {
        super(RoleSchema as any);
    }
}

Object.seal(RoleRepository);
