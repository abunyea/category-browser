import { Form, Link, redirect, useLoaderData } from 'react-router-dom';
import { Button, Input, Stack } from '@mui/material';

export default function EditCategory() {
  const category = useLoaderData() || {};
  return (
  <>
    <Form method='post' id='category-form'>
      <Stack>
      <label>Name: 
        <Input type='text' name='displayName' defaultValue={category.displayName} />
      </label>
      <label>Alternate names: 
        <Input type='text' name='alternateNames' defaultValue={category.alternateNames} />
      </label>
      <label>Description: 
        <Input type='textarea' multiline name='description' defaultValue={category.description} />
      </label>
      Parents
      <ul>
        {category.parents ? category.parents.map((parent) =>
          <li key={parent.conceptId}>
            <Link to={`/categories/${parent.conceptId}`}>{parent.displayName}</Link>
          </li>
        ) : 'No parents'}
      </ul>
      Children
      <ul>
        {category.children ? category.children.map((child) =>
          <li key={child.conceptId}>
            <Link to={`/categories/${child.conceptId}`}>{child.displayName}</Link>
          </li>
        ) : 'No children'}
      </ul>
      <p>
        <Button type="submit">Save</Button>
        <Button type="button">Cancel</Button>
      </p>
      </Stack>
    </Form>
    <Form method='post' action={`/categories/${category.conceptId}/destroy`}
          onSubmit={(event) => {
            if (!window.confirm('Warning! Deleting this concept will orphan its children.')) {
              event.preventDefault();
            }
          }}
    >
      <Button type='submit'>Delete</Button>
    </Form>
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
  const response = await fetch(`/api/categories`, {
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
