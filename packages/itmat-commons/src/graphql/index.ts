import * as appUsers from './appUsers';
import * as curation from './curation';
import * as fields from './fields';
import * as files from './files';
import * as log from './log'
import * as permission from './permission';
import * as projects from './projects';
import * as query from './query';
import * as study from './study';
import * as user from './user';
import * as subscription from './subscription';
export * from './appUsers';
export * from './curation';
export * from './fields';
export * from './files';
export * from './log'
export * from './permission';
export * from './projects';
export * from './query';
export * from './study';
export * from './user';
export * from './subscription';
export const GQLRequests = { ...subscription, ...appUsers, ...curation, ...fields, ...files, ...log, ...permission, ...projects, ...query, ...study, ...user };
