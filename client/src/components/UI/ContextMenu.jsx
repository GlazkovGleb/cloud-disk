import React from 'react'
import { ListItemIcon, ListItemText, MenuItem, MenuList, Paper } from '@mui/material';

const ContextMenu = ({ menu, open, position }) => {
    return (
        <Paper
            sx={{
                display: open ? 'block' : 'none',
                position: 'fixed',
                zIndex: 2,
                left: position[0],
                top: position[1]
            }}
        >
            <MenuList>
                {menu.map(menuItem =>
                    <MenuItem
                        key={menuItem.name}
                        onClick={menuItem.onClick}
                    >
                        <ListItemIcon>
                            {menuItem.icon}
                        </ListItemIcon>
                        <ListItemText>{menuItem.name}</ListItemText>
                    </MenuItem>
                )
                }
            </MenuList>
        </Paper>
    )
}

export default React.memo(ContextMenu) 