import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'

const Sort = ({sort, handleSort}) => {
    return (
        <FormControl sx={{ minWidth: 160, marginRight: '20px' }} size='small' >
            <InputLabel >Сортировка по</InputLabel>
            <Select
                value={sort}
                label="Сортировка по"
                onChange={handleSort}
                autoWidth
                color='secondary'
            >
                <MenuItem value={'name'}>Имени</MenuItem>
                <MenuItem value={'type'}>Типу</MenuItem>
                <MenuItem value={'date'}>Дате</MenuItem>
            </Select>
        </FormControl>
    )
}

export default React.memo(Sort) 