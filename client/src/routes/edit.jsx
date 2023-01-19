import { Form, Link, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { Button, TextField, Stack } from '@mui/material';

export default function EditCategory() {
  const category = useLoaderData() || {};
  const navigate = useNavigate();

  return (
  <>
    <h2>{category.conceptId ? 'Edit' : 'Add New Concept'}</h2>
    <Stack spacing={2}>
    <Form method='post' id='category-form'>
      <Stack spacing={2}>
        <TextField
	  required
	  type='text'
	  name='displayName'
	  label='Name'
	  defaultValue={category.displayName} />
        <TextField
	  type='text'
	  name='alternateNames'
	  label='Alternate Names'
	  defaultValue={category.alternateNames} />
        <TextField 
	  type='textarea'
	  multiline 
	  name='description'
	  label='Description'
	  defaultValue={category.description} />
        <div>
       	  {category.parents && category.parents.length > 0 ? 'Parents:' : 'No Parents'}
          <ul>
            {category.parents && category.parents.map((parent) =>
              <li key={parent.conceptId}>
                <Link to={`/categories/${parent.conceptId}`}>{parent.displayName}</Link>
              </li>
            )}
          </ul>
        </div>
        <div>
          {category.children && category.children.length > 0 ? 'Children:' : 'No Children'}
          <ul>
            {category.children && category.children.map((child) =>
              <li key={child.conceptId}>
                <Link to={`/categories/${child.conceptId}`}>{child.displayName}</Link>
              </li>
            )}
          </ul>
        </div>
        <Stack direction='row' spacing={1}>
          <Button variant='contained' type='submit'>Save</Button>
          <Button variant='contained' type='button' onClick={() => {
              navigate(-1);
            }}>Cancel
	  </Button>
        </Stack>
      </Stack>
    </Form>
    <Form method='post' action={`/categories/${category.conceptId}/destroy`}
          onSubmit={(event) => {
            if (!window.confirm('Warning! Deleting this concept will orphan its children.')) {
              event.preventDefault();
            }
          }}>
      <Button variant='contained' type='submit' color='error'>Delete</Button>
    </Form>
    </Stack>
  </>
  );
}

export async function loader({ params }) {
  const response = await fetch(`/api/categories/${params.conceptId}`);
  const category = await response.json();
  return category;
}

export async function editAction({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const response = await fetch(`/api/categories/${params.conceptId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error('Failed to update');
  }
  return redirect(`/categories/${params.conceptId}`);
}

export async function createAction({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const searchParams = new URL(request.url).searchParams;
  if (searchParams.has('parentId')) {
    updates['parentIds'] = [searchParams.get('parentId')];
  }
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error('Failed to create');
  }
  const body = await response.json();
  return redirect(`/categories/${body.conceptId}`);
}

export async function destroyAction({ params }) {
  const response = await fetch(`/api/categories/${params.conceptId}`, {
    method: 'DELETE'
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error('Failed to create');
  }
  return redirect('/');
}
