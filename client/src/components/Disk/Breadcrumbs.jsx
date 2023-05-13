import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentDirAction, updateStackAction } from '../../reducers/fileReducer';



export default function CollapsedBreadcrumbs() {
    const currentDir = useSelector(state => state.files.currentDir)
    const dirStack = useSelector(state => state.files.dirStack)
    const dispatch = useDispatch()

    const goToDirHandler = (dir) => {
        dispatch(setCurrentDirAction(dir))
        const indexDir = dirStack.findIndex(item => item._id === dir._id)
        dispatch(updateStackAction(dirStack.slice(0, indexDir)))
    }

    return (
        <Box>
            <Breadcrumbs maxItems={6} aria-label="breadcrumb">
                {dirStack.map(dir =>
                    <Link
                        underline="hover"
                        color="inherit"
                        component="button"
                        variant="h6"
                        key={dir._id}
                        onClick={() => goToDirHandler(dir)}
                    >
                        {dir.name}
                    </Link>
                    )}
                    <Typography
                        variant="h6"
                    >{currentDir.name}</Typography>
                
            </Breadcrumbs>
        </Box>
    );
}
