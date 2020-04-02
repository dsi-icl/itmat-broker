import * as React from 'react';
import css from './subsection.module.css';

export const Subsection: React.FC<{ title: string, children: any }> = ({ title, children }) => (
    <div className={css.content_section}>
        <h5>{title}</h5>
        <div>
            {children}
        </div>
    </div>
);
