import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import React from 'react'

const SelectView = ({view, handleChangeView}) => {
    return (
        <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleChangeView}
            size='small'
            color='secondary'
        >
            <ToggleButton value="list" aria-label="list">
                <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="module" aria-label="module">
                <ViewModuleIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    )
}

export default React.memo(SelectView) 