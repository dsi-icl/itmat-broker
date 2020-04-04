import { IProject } from '@itmat/commons';
import * as React from 'react';
import { Query } from '@apollo/react-components'
import { NavLink, Redirect } from 'react-router-dom';
import { WHO_AM_I } from '@itmat/commons';

export const ProjectList: React.FC = (props) => (
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
            if (data.whoAmI && data.whoAmI.access && data.whoAmI.access.projects) {
                const { projects } = data.whoAmI.access;
                if (projects.length === 1) {
                    return <Redirect to={`/projects/${projects[0].id}/dashboard`} />;
                }
                if (projects.length > 1) {
                    return <PickProjectSection projects={projects} />;
                }
            }

            return <p>There is no project or you have not been added to any. Please contact admin.</p>;
        }}
    </Query>
);

const PickProjectSection: React.FC<{ projects: IProject[] }> = ({ projects }) => (
    <>
        You have access to two or more projects. Please pick the one you would like to access:
        {' '}
        <br />
        <br />
        <br />
        {projects.map((el) => (
            <NavLink key={el.id} to={`/projects/${el.id}/dashboard`}>
                <button>{el.name}</button>
            </NavLink>
        ))}
    </>
);