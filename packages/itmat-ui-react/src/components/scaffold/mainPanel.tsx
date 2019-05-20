import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import * as css from './scaffold.module.css';
import { UserPage } from '../users';
import { StudyControl } from '../studyControlPanel';
import { ProjectListPage } from '../projectList';
import { AppQuery } from '../query';
import { ProjectDetailPage } from '../projectDetail';
// import { AddApplication } from '../studyControlPanel/applicationsSection';

export const MainPanel: React.FunctionComponent = props => {
    return (
        <div className={css.main_panel}>
            <Switch>
                <Route path='/studies/details/:studyName' render={({ match }) => <StudyControl name={match.params.studyName}/>}/>
                <Route path='/projects/:projectId' render={({ match }) => <ProjectDetailPage projectId={match.params.projectId}/>}/>
                <Route path='/projects' render={({match}) => <ProjectListPage/>}/>
                <Route path='/queries' render={({match}) => <AppQuery/>}/>
                <Route path='/users' render={() => <UserPage/>}/>
                <Route path='/' render={() => <></>}/>
            </Switch>
        </div>
    );
};