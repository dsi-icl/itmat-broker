import * as React from 'react';
import { useMutation } from '@apollo/client';
import { Query } from '@apollo/react-components';
import { userTypes } from '@itmat/commons';
import { WHO_AM_I } from '@itmat/commons';
import { CREATE_STUDY } from '@itmat/commons';

export const AddNewDataSet: React.FC = (props) => {
    const [showMore, setShowMore] = React.useState(false);
    const [createStudy, { loading: createStudyLoading, error: createStudyError }] = useMutation(CREATE_STUDY, { onCompleted: () => { setNewName(''); setShowMore(false); }, refetchQueries: [{ query: WHO_AM_I }] });
    const [newName, setNewName] = React.useState('');
    const [inputError, setInputError] = React.useState('');
    return (
        <Query<any, any>
            query={WHO_AM_I}
            pollInterval={5000}
        >
            {({ loading, error, data }) => {
                if (loading) { return <p>Loading...</p>; }
                if (error) {
                    return (
                        <p>
                            Error :(
                            {error}
                        </p>
                    );
                }
                if (data.whoAmI && data.whoAmI.type && data.whoAmI.type === userTypes.ADMIN) {
                    return (
                        !showMore
                            ? <button onClick={() => setShowMore(true)}>Add new dataset</button>
                            : (
                                <div>
                                    <label>
                                        Enter name:
                                        <input value={newName} onChange={(e) => { setNewName(e.target.value); setInputError(''); }} type="text" />
                                    </label>
                                    <button className="button_grey" onClick={() => { setShowMore(false); setNewName(''); }}>Cancel</button>
                                    {
                                        createStudyLoading
                                            ? <button>Loading...</button>
                                            : (
                                                <button onClick={() => {
                                                    if (newName === '') {
                                                        setInputError('Please provide a study name.');
                                                        return;
                                                    }
                                                    createStudy({ variables: { name: newName } });
                                                }}
                                                >
                                                    Submit
                                                </button>
                                            )
                                    }
                                    {
                                        createStudyError
                                            ? <div className="error_banner">Error creating study. Please contact admin.</div>
                                            : null
                                    }
                                    {
                                        inputError !== ''
                                            ? <div className="error_banner">{inputError}</div>
                                            : null
                                    }
                                </div>
                            )
                    );
                }
                return null;
            }}
        </Query>
    );
};