/* eslint-disable */
import mongoose from 'mongoose';

export class RepositoryBase<T extends mongoose.Document> {
    protected _model: mongoose.Model<mongoose.Document>;

    constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this._model = schemaModel;
    }

    async create(item: T) {
        return this._model.create(item);
    }

    async insertMany(items: T[]) {
        return this._model.insertMany(items);
    }

    createOrUpdate(cond: Object, document: Object): Promise<any> {
        return this._model.updateOne(cond, document, { upsert: true }).exec();
    }

    deleteByCondition(cond: Object): Promise<any> {
        return this._model.deleteMany(cond).exec();
    }

    async findAsync<TResult extends mongoose.Document>(condition: Object): Promise<TResult[]> {
        return <TResult[]>await this._model.find(condition);
    }

    async findOneAsync<TResult extends mongoose.Document>(cond: Object): Promise<TResult> {
        return <TResult>await this._model.findOne(cond).exec();
    }

    async findByIdAndUpdate(id: string, update: any) {
        await this._model.findByIdAndUpdate(id, update);
    }

    deleteOne(id: string): void {
        this._model.findByIdAndDelete(id);
    }

    private toObjectId(id: string): mongoose.Types.ObjectId {
        // @ts-ignore
        return new mongoose.Types.ObjectId.createFromHexString(id);
    }

    async updateOne(cond: Object, doc: Object, filters?: Object) {
        return this._model.updateOne(cond, doc, filters);
    }

    async findOneAndUpdate(cond: Object, doc: Object, options?: Object) {
        return this._model.findOneAndUpdate(cond, doc, options);
    }

    async findByIdAndDelete(id: any) {
        await this._model.findByIdAndDelete(id);
    }

    async findById<TResult extends mongoose.Document>(id: any): Promise<TResult> {
        return <TResult>await this._model.findById(id).exec();
    }

    async findOne<TResult extends mongoose.Document>(cond: Object): Promise<TResult> {
        return <TResult>await this._model.findOne(cond).exec();
    }

    async remove(cond: Object) {
        await this._model.deleteMany(cond);
    }

    async find(cond = {}) {
        return this._model.find(cond).lean();
    }
}
