import { InMemoryCache } from '@apollo/client/cache';
import { ApolloClient, from, split } from '@apollo/client';
import { ApolloLink } from '@apollo/client/core';
import { onError } from '@apollo/link-error';
import { WebSocketLink } from '@apollo/link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = new WebSocketLink({
    uri: 'ws://localhost:3003/graphql',
    options: {
        reconnect: true,
    },
});

const uploadLink = createUploadLink({
    uri: 'http://localhost:3003/graphql',
    credentials: 'include',
}) as any;

uploadLink.onError = () => { return; }
uploadLink.setOnError = () => { return uploadLink; }

const link = split(
    // split based on operation type
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query) as any;
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    uploadLink as ApolloLink,
);

const cache = new InMemoryCache({
    dataIdFromObject: (object) => `${object.__typename || 'undefined_typeName'}___${object.id || 'undefined_id'}`,
});

export const client = new ApolloClient({
    link: from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                graphQLErrors.map(({ message, locations, path }) =>
                    // tslint:disable-next-line: no-console
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    ));
            }
            if (networkError) { console.error('[Network error]:', networkError); }
        }),
        link,
    ]),
    cache,
});
