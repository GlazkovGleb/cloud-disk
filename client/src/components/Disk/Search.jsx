import { InputBase, Paper } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import React from 'react'

const Search = ({search, handleSearch}) => {
    return (
        <Paper sx={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }} elevation={4} >
            <InputBase
                placeholder='Поиск...'
                value={search}
                onChange={handleSearch}
            />
            <SearchIcon />
        </Paper>
    )
}

export default React.memo(Search) 