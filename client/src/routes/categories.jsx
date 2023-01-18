import { Link, useLoaderData } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Categories() {
  const categories = useLoaderData();
  return (
    <>
      <h3>All Categories</h3>
      <Stack>
        {categories.map((category) => (
          <Typography>
            <Link to={`/categories/${category.conceptId}`}>{category.displayName}</Link>
          </Typography>
        ))}
      </Stack>
    </>
  );
}

export async function loader() {
  const response = await fetch('/api/categories');
  const categories = await response.json();
  return categories;
}

export async function searchLoader({ request }) {
  const q = new URL(request.url).searchParams.get('q');
  const response = await fetch(`/api/categories/search?q=${q}`);
  const categories = await response.json();
  return categories;
}
