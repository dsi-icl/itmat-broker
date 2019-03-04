import mongodb from 'mongodb';
import { IDatabaseBaseConfig, DatabaseBase, CustomError } from 'itmat-utils';
import config from '../../config/config.json';
export interface IDatabaseConfig extends IDatabaseBaseConfig {
    collections: {
        users_collection: string,
        jobs_collection: string,
        studies_collection: string,
        queries_collection: string,
        field_dictionary_collection: string
    }
}

export class Database extends DatabaseBase<IDatabaseConfig> {
    public jobs_collection?: mongodb.Collection;
    public users_collection?: mongodb.Collection;
    public studies_collection?: mongodb.Collection;
    public queries_collection?: mongodb.Collection;
    public field_dictionary_collection?: mongodb.Collection;

    protected assignCollections(): void {
        const database = this.getDB();
        this.jobs_collection = database.collection(this.config.collections.jobs_collection);
        this.users_collection = database.collection(this.config.collections.users_collection);
        this.studies_collection = database.collection(this.config.collections.studies_collection);
        this.queries_collection = database.collection(this.config.collections.queries_collection);
        this.field_dictionary_collection = database.collection(this.config.collections.field_dictionary_collection);
    }
}

export const db = new Database(config.database);