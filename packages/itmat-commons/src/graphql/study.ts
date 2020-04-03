import { gql } from '@apollo/client';
import { JOB_FRAGMENT } from './curation';

export const GET_STUDIES_LIST = gql`
    {
        getStudies {
            id
            name
            projects {
                id
                studyId
                name
            }
        }
    }
`;

export const DELETE_STUDY = gql`
    mutation deleteStudy($name: String!) {
        deleteStudy(name: $name) {
            id
            successful
        }
    }
`;

export const GET_STUDY = gql`
    query getStudy($studyId: String!) {
        getStudy(studyId: $studyId) {
            id
            name
            createdBy
            jobs {
                ...ALL_FOR_JOB
            }
            projects {
                id
                studyId
                name
            }
            roles {
                id
                name
                permissions
                projectId
                studyId
                users {
                    id
                    realName
                    organisation
                    username
                }
            }
            files {
                id
                fileName
                studyId
                projectId
                fileSize
                description
                uploadedBy
            }
            numOfSubjects
            currentDataVersion
            dataVersions {
                id
                version
                tag
                uploadDate
                jobId
                extractedFrom
                fileSize
                contentId
                fieldTrees
            }
        }
    }
    ${JOB_FRAGMENT}
`;

export const CREATE_STUDY = gql`
    mutation createStudy($name: String!){
        createStudy(name: $name) {
            id
            name
        }
    }
`;

export const CREATE_PROJECT = gql`
    mutation createProject($studyId: String!, $projectName: String!, $approvedFields: [String]) {
        createProject(studyId: $studyId, projectName: $projectName, approvedFields: $approvedFields) {
            id
            studyId
            name
            approvedFields
        }
    }
`;

export const DELETE_PROJECT = gql`
    mutation deleteProject($projectId: String!) {
        deleteProject(projectId: $projectId) {
            id
            successful
        }
    }
`;

export const SET_DATAVERSION_AS_CURRENT = gql`
    mutation setDataversionAsCurrent($studyId: String!, $dataVersionId: String!) {
        setDataversionAsCurrent(studyId: $studyId, dataVersionId: $dataVersionId) {
            id
            currentDataVersion
            dataVersions {
                id
                version
                tag
                uploadDate
                jobId
                extractedFrom
                contentId
                fileSize
                fieldTrees
            }
        }
    }
`;
