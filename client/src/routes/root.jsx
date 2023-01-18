import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Form, Outlet } from 'react-router-dom';

const theme = createTheme();

export default function Root() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Category Browser 
            </Typography>
            <Form id='search-form' action='/search' role='search'>
              <TextField label='Search'
                         name='q'
                         type='search'
                         variant='filled'
                         size='small'/>
            </Form>
          </Toolbar>
        </AppBar>
          <Container maxWidth='sm'>
            <Outlet />
          </Container>
      </ThemeProvider>
    </>
  );
}

