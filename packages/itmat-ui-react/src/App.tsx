import * as React from 'react';
import { Query } from 'react-apollo';
import { Switch, Route } from 'react-router-dom';
import Providers from './Providers';
import { LoginBox } from './components/login/login';
import { Spinner } from './components/reusable/icons/spinner';
import { MainMenuBar } from './components/scaffold/mainMenuBar';
import { MainPanel } from './components/scaffold/mainPanel';
import css from './components/scaffold/scaffold.module.css';
import { ResetPasswordPage } from './components/resetPasswordPage/resetPasswordPage';
import { RequestResetPassword } from './components/resetPasswordPage/requestResetPasswordPage';
import { WHO_AM_I } from 'itmat-commons';

export const App: React.FunctionComponent = () => (
    <Providers>
        <Switch>
            <Route path='/resetPassword/:encryptedEmail/:token' component={ResetPasswordPage}/>
            <Route path='/requestResetPassword' component={RequestResetPassword}/>
            <Route>
                <Query<any, any> query={WHO_AM_I}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            return (
                                <div style={{
                                    width: '100%', height: '100%', textAlign: 'center', paddingTop: '20%',
                                }}
                                >
                                    <Spinner />
                                </div>
                            );
                        }
                        if (error) {
                            return (
                                <p>
                                    Error :(
                                    {' '}
                                    {error.message}
                                </p>
                            );
                        }
                        if (data.whoAmI !== null && data.whoAmI !== undefined && data.whoAmI.username !== null) { // if logged in return the app
                            return <div className={css.app + ' dark_theme'}>
                                <MainMenuBar projects={data.whoAmI.access.projects} />
                                <MainPanel />
                            </div>;
                        }
                        return <LoginBox />; // if not logged in return the login boxs
                    }}
                </Query>
            </Route>
        </Switch>
    </Providers>
);

export default App;
