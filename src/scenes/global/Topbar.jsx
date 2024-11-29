import {Box, IconButton, Menu, MenuItem} from '@mui/material';
import { ColorModeContext, tokens } from '../../theme';
import { useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsPowerIcon from '@mui/icons-material/SettingsPower';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { useTheme } from '@emotion/react';

const Topbar = ({ onLogout }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        onLogout();
        navigate('/login'); // Redirect to login page
    };

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* SettingsPowerIcon bar */}
            <Box 
                display="flex-end" 
                borderRadius="3px"
                p={1}
            >
                <IconButton>
                    <SettingsPowerIcon />
                </IconButton>
            </Box>
                
            {/* Icons */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === 'dark' ? (
                        <LightModeOutlinedIcon />
                    ) : (
                        <DarkModeOutlinedIcon />
                    )}
                </IconButton>
                <IconButton onClick={handleMenuOpen}>
                    <PersonOutlinedIcon />
                </IconButton>
                {/* Logout Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleLogout}>
                        <ExitToAppOutlinedIcon sx={{ marginRight: 1 }} />
                        Logout
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};

export default Topbar;