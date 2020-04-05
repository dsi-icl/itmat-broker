import request from 'request';
import fs from 'fs';
import MemoryStream from 'memorystream';
import Container from './container';

/**
 * @class Segment
 * @param container {Container} Container the segment is stored into
 * @param name {String} Name of this segment
 * @constructor
 */
export class Segment {

    _container: Container;
    _name: string;

    constructor(container: Container, name: string) {
        //Init member attributes
        this._container = container;
        this._name = name;
    }

    /**
     * @fn createFromDisk
     * @desc Performs a creation operation for this Segment, replaces its content if already exists
     * @param filepath Absolute or relative path to the file on disk
     * @return {Promise} resolve to true on success, on error rejects with a native js Error
     */
    createFromDisk = (filepath): Promise<true | Error> => {
        const readStream = fs.createReadStream(filepath);

        return this.createFromStream(readStream);
    };

    /**
     * @fn createFromStream
     * @desc Performs a creation operation for this Segment, replaces its content if already exists
     * @param readStream Segment content in the form of a Node.js stream.Readable instance
     * @return {Promise} resolve to true on success, on error rejects with a native js Error
     */
    createFromStream = (readStream): Promise<true | Error> => {
        const _this = this;
        return new Promise(function (resolve, reject) {
            const options = {
                method: 'PUT',
                baseUrl: _this._container.getAccount().getStorageUrl(),
                uri: _this._container.getName() + '/' + _this._name,
                headers: {
                    'X-Auth-Token': _this._container.getAccount().getToken()
                },
                body: readStream
            };
            request(options, function (error, response, __unused__body) {
                if (error) {
                    reject(error);
                    return;
                }
                if (response.statusCode !== 201) {
                    reject(new Error(response.statusMessage));
                    return;
                }
                resolve(true);
            });
        });
    };

    /**
     * @fn delete
     * @desc Delete this object form the Object Storage
     * @return {Promise} Resolve to true on success, otherwise a native js Error is rejected
     */
    delete = (): Promise<true | Error> => {
        const _this = this;
        return new Promise(function (resolve, reject) {
            const options = {
                method: 'DELETE',
                baseUrl: _this._container.getAccount().getStorageUrl(),
                uri: _this._container.getName() + '/' + _this._name,
                headers: {
                    'X-Auth-Token': _this._container.getAccount().getToken()
                }
            };
            request(options, function (error, response, __unused__body) {
                if (error) {
                    reject(error);
                    return;
                }
                if (response.statusCode !== 204) {
                    reject(response.statusMessage);
                    return;
                }
                resolve(true);
            });
        });
    };

    /**
     * @fn copy
     * @desc Copies this object to the destination object.
     * If the destination object is already created in the Object storage, it is replaced
     * If the source segment is a Large Object, the manifest is copied, referencing the same content.
     * @param object {Segment} Destination object
     * @return {Promise} Resolves to true on success, rejects a js native Error otherwise
     */
    copy = (object): Promise<true | Error> => {
        const _this = this;
        return new Promise(function (resolve, reject) {
            const heads = {
                'X-Auth-Token': _this._container.getAccount().getToken(),
                'Destination': object.getContainer().getName() + '/' + object.getName(),
                'Destination-Account': object.getContainer().getAccount().getName()
            };
            const options = {
                method: 'COPY',
                baseUrl: _this._container.getAccount().getStorageUrl(),
                uri: '/' + _this._name + '?multipart-manifest=get',
                headers: heads
            };
            request(options, function (error, response, __unused__body) {
                if (error) {
                    reject(error);
                    return;
                }
                if (response.statusCode !== 201) {
                    reject(new Error(response.statusMessage));
                    return;
                }
                resolve(true);
            });
        });
    };

    /**
     * @fn getContentStream
     * @desc Get the stored object content
     * @return {Promise} resolve to a NodeJS.ReadableStream on success, rejects a js Error otherwise
     */
    getContentStream = (): Promise<NodeJS.ReadableStream | Error> => {
        const _this = this;
        return new Promise(function (resolve, reject) {
            const options = {
                method: 'GET',
                baseUrl: _this._container.getAccount().getStorageUrl(),
                uri: _this._container.getName() + '/' + _this._name,
                headers: {
                    'X-Auth-Token': _this._container.getAccount().getToken()
                }
            };
            request(options)
                .on('response', function (response) {
                    if (response.statusCode !== 200) {
                        reject(new Error(response.statusMessage));
                        return;
                    }

                    const stream = new MemoryStream([]);
                    response.on('data', function (data) {
                        stream.write(data);
                    });
                    response.on('end', function () {
                        stream.end();
                    });
                    resolve(stream);
                })
                .on('error', function (error) {
                    reject(error);
                });
        });
    };

    /**
     * @fn getMetadata
     * @desc Get the stored metadata on this segment
     * @return {Promise} Resolves to js object where each key:value pair is one metadata entry,
     * reject to js native error otherwise
     */
    getMetadata = (): Promise<any | Error> => {
        const _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._container.getAccount().isConnected() === false) {
                reject(new Error('Segment needs a connected  container/account'));
                return;
            }
            const options = {
                method: 'HEAD',
                baseUrl: _this._container.getAccount().getStorageUrl(),
                uri: _this._container.getName() + '/' + _this._name,
                headers: {
                    'X-Auth-Token': _this._container.getAccount().getToken()
                }
            };
            request(options, function (error, response, __unused__body) {
                if (error) {
                    reject(error);
                    return;
                }
                if (response.statusCode !== 200) {
                    reject(new Error(response.statusMessage));
                    return;
                }

                const metas = {};
                for (const m in response.headers) {
                    if (m.toLowerCase().includes('x-object-meta-')) { // Add to metas
                        const meta_name = m.substr(14);
                        metas[meta_name] = response.headers[m];
                    }
                }
                resolve(metas);
            });
        });
    };

    /**
     * @fn setMetadata
     * @desc Sets some metadata on this object, connected state is required
     * @param metadata Plain js object, each key:value is a metadata field
     * @return {Promise} resolves to true on success, on error rejects a native js Error
     */
    setMetadata = (metadata): Promise<true | Error> => {
        const _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._container.getAccount().isConnected() === false) {
                reject(new Error('Segment needs a connected  container/account'));
                return;
            }

            const metas = {};
            for (const m in metadata) {
                const meta_name = 'X-Object-Meta-' + m;
                metas[meta_name] = metadata[m];
            }
            const heads = Object.assign({}, {
                'X-Auth-Token': _this._container.getAccount().getToken()
            }, metas);
            const options = {
                method: 'POST',
                baseUrl: _this._container.getAccount().getStorageUrl(),
                uri: _this._container.getName() + '/' + _this._name,
                headers: heads
            };

            request(options, function (error, response, __unused__body) {
                if (error) {
                    reject(error);
                    return;
                }
                if (response.statusCode !== 202) {
                    reject(new Error(response.statusMessage));
                    return;
                }
                resolve(true);
            });
        });
    };
    /**
     * @fn getName
     * @desc Getter on name member
     * @return {String} Segment name
     */
    getName = (): string => {
        return this._name;
    };

    /**
     * @fn setName
     * @param name {String} New value for object name
     * @return {String} Assigned value for name member
     */
    setName = (name): string => {
        this._name = name;
        return this._name;
    };

    /**
     * @fn getContainer
     * @desc Getter on container member
     * @return {Container} Container member value
     */
    getContainer = (): Container => {
        return this._container;
    };

    /**
     * @fn setContainer
     * @param container New container
     * @return {Container} Assigned container value
     */
    setContainer = (container): Container => {
        this._container = container;
        return this._container;
    };
}

export default Segment;