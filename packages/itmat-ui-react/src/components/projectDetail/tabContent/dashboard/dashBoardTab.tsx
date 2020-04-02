import { IJobEntry } from 'itmat-commons/dist/models/job';
import * as React from 'react';
import { Subsection } from '../../../reusable/subsection/subsection';
import { JobSection } from './jobs';
import css from './tabContent.module.css';

export const DashboardTabContent: React.FC<{ studyId: string, jobs: IJobEntry<any>[] }> = ({ jobs }) => (
    <div className={css.tab_page_wrapper}>
        <Subsection title="Data summary">
            {/* <DataSummary showSaveVersionButton={false} studyId={studyId}/> */}
        </Subsection>
        <Subsection title="Past Jobs">
            <JobSection jobs={jobs} />
        </Subsection>
    </div>
);
