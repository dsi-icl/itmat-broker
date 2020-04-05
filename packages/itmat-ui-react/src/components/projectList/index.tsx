import * as React from 'react';
import { ProjectList } from './projectList';
import * as css from './projectPage.module.css';

export const ProjectListPage: React.FunctionComponent = (props) => {
    return (
        <div className={css.page_container}>
            <div className={css.project_list + ' page_section'}>
                <div className="page_ariane">PROJECTS</div>
                <div className="page_content">
                    <ProjectList />
                </div>
            </div>
        </div>
    );
};