import * as monaco from 'monaco-editor';
import * as React from 'react';
import { Models } from 'itmat-utils';
import { Mutation } from "react-apollo";
import css from '../../css/query.module.css';
import { CREATE_QUERY } from '../../graphql/query';
import { providerFactory, tokeniser, theme } from './languageDefinition';

export class Editor extends React.Component<{ studyName: string, applicationName: string, fieldList: Models.Field.IFieldEntry[] }, { monaco: any }> {
    constructor(props: any) {
        super(props);
        this.state = { monaco };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    shouldComponentUpdate(nextProps: { studyName: string, applicationName: string }){
        if (nextProps.studyName !== this.props.studyName || nextProps.applicationName !== this.props.applicationName) {
            return true;
        } else {
            return false;
        }
    }

    componentDidMount() {
        monaco.editor.defineTheme('itmat-query-theme', theme as any);

        monaco.languages.register({ id: 'itmat-query-language'});
        monaco.languages.setMonarchTokensProvider('itmat-query-language', tokeniser as any);
        monaco.languages.registerCompletionItemProvider('itmat-query-language', providerFactory(this.props.fieldList));

        monaco.editor.create(document.getElementById('container')!, {
            value: '',
            language: 'itmat-query-language',
            theme: 'itmat-query-theme',
            automaticLayout: true
          });
    }

    handleSubmit() {
        this.state.monaco.editor.getModels()[0].getValue(1, false);
    }

    render() {
        return <>
        <div id='container'></div>
        <Mutation
            mutation={CREATE_QUERY}
        >
        {(createQuery, { loading, error }) => {
            if (loading) return <div className={css.submitButton}>Loading</div>;
            return <div className={css.submitButton} onClick={e => { createQuery({ variables: {
                query: {
                    queryString: this.state.monaco.editor.getModels()[0].getValue(1, false),
                    study: this.props.studyName,
                    application: this.props.applicationName
                }
            }}); }}>Submit</div>
        }}
        </Mutation>
        </>;
    }
}