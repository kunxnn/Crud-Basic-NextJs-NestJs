import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            MyApp
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} href="/">Home</Button>
          <Button color="inherit" component={Link} href="/">Production</Button>
          <Button color="inherit" component={Link} href="/">Feature</Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" component={Link} href="/login">Login</Button>
          <Button color="inherit" component={Link} href="/register">Register</Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
}
