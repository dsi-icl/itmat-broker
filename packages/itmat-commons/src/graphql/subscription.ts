import { gql } from '@apollo/client';


export const SUBSCRIBE_TO_JOB_STATUS = gql`
    subscription subscribeToJobStatusChange($studyId: String!) {
        subscribeToJobStatusChange(studyId: $studyId) {
            jobId
            newStatus
            errors
        }
    }
`;
