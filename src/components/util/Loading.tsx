import React from 'react';
import { useTheme } from '@material-ui/core';
import RingLoader from 'react-spinners/RingLoader';

export default function Loading() {
        const theme = useTheme();
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8em' }}>
                <RingLoader color={theme.palette.secondary.main} size={50} />
            </div>
        );
}
