import * as React from 'react';
import css from './spinner.module.css';

export const Spinner: React.FC = () => (
    <div style={{ width: '30%', margin: '0 auto' }}>
        <div style={{ display: 'block', transform: 'scale(0.5, 0.5)' }}>
            <div style={{ width: '100%', height: '100%' }} className={css.ldsPacman}>
                <div>
                    <div />
                    <div />
                    <div />
                </div>
                <div>
                    <div />
                    <div />
                </div>
            </div>
        </div>
        <div style={{ position: 'relative', top: 55, right: 45 }}>Crunching...</div>
    </div>
);

export default Spinner;