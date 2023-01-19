import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Form, Outlet, Link } from 'react-router-dom';

const theme = createTheme();

export default function Root() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar position="relative">
          <Toolbar>
	    <Stack direction='row' spacing={2}>
              <Typography variant='h6' color='inherit'>
                Ontology Concepts
              </Typography>
	      <Button variant='contained' component={Link} to='/'>Home</Button>
	      <Button variant='contained' component={Link} to='/categories/new'>Add Concept</Button>
              <Form id='search-form' action='/search' role='search'>
                <Input id='search-input' 
                       label='Search'
                       name='q'
                       type='search'
                       variant='filled'
	               placeholder='Search'
                       size='small' />
              </Form>
	    </Stack>
          </Toolbar>
        </AppBar>
          <Container maxWidth='sm'>
            <Outlet />
          </Container>
      </ThemeProvider>
    </>
  );
}

