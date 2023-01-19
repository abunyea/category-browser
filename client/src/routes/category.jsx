import { Link, useLoaderData } from 'react-router-dom';
import { Button, Stack } from '@mui/material';

export default function Category() {
  const category = useLoaderData();
  return (
    <>
      <h2>{category.displayName}</h2>
      <p><i>Alternate names: {category.alternateNames}</i></p>
      <p>{category.description}</p>
      {category.parents.length > 0 ? 'Parents:' : 'No Parents'}
      <ul>
        {category.parents.map((parent) =>
          <li key={parent.conceptId}><Link to={`/categories/${parent.conceptId}`}>{parent.displayName}</Link></li>
        )}
      </ul>
      {category.parents.length > 0 ? 'Children:' : 'No Children'}
      <ul>
        {category.children.map((child) =>
          <li key={child.conceptId}><Link to={`/categories/${child.conceptId}`}>{child.displayName}</Link></li>
        )}
      </ul>
      <Stack direction='row' spacing={1}>
        <Button variant='contained' component={Link} to='edit'>Edit</Button>
        <Button variant='contained' component={Link} to={`/categories/new?parentId=${category.conceptId}`}>
	  Add Child
	</Button>
      </Stack>
    </>
  );
}

export async function loader({ params }) {
  const response = await fetch(`/api/categories/${params.conceptId}`);
  const category = await response.json();
  return category;
}
