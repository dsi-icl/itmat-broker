import gql from 'graphql-tag';

export const field_fragment = gql`
    fragment ALL_FOR_FIELD on Field {
        id
        studyId
        fieldId
        fieldName
        dataType
        possibleValues {
            code
            description
        }
        unit
        comments
        dateAdded
        deleted
    }
`;

export const GET_STUDY_FIELDS = gql`
    query getStudyFields($studyId: String!, $projectId: String) {
        getStudyFields(studyId: $studyId, projectId: $projectId) {
            ...ALL_FOR_FIELD
        }
    }
    ${field_fragment}
`;

export const CREATE_NEW_FIELD = gql`
    mutation createNewField($studyId: String!, $fieldInput: FieldInput!) {
        createNewField(studyId: $studyId, fieldInput: $fieldInput) {
            ...ALL_FOR_FIELD
        }
    }
    ${field_fragment}
`;

export const EDIT_FIELD = gql`
    mutation editField($studyId: String!, $fieldInput: FieldInput!) {
        editField(studyId: $studyId, fieldInput: $fieldInput) {
            ...ALL_FOR_FIELD
        }
    }
    ${field_fragment}
`;

export const DELETE_FIELD = gql`
    mutation deleteField($studyId: String!, $fieldId: String!) {
        deleteField(studyId: $studyId, fieldId: $fieldId) {
            ...ALL_FOR_FIELD
        }
    }
    ${field_fragment}
`;
