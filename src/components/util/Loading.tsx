import React from 'react';
import { useTheme } from '@material-ui/core';
import RingLoader from 'react-spinners/RingLoader';

export default function Loading() {
        const theme = useTheme();
        return (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <RingLoader color={theme.palette.secondary.main} size={50} />
            </div>
        );
}
