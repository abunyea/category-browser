import { Link, useLoaderData } from 'react-router-dom';

export default function Categories() {
  const categories = useLoaderData();
  return (
      <ul>
        {categories.map((category) => (
          <li>
            {category.displayName} <Link to={`categories/${category.conceptId}`}>View</Link>
          </li>
        ))}
      </ul>
  );
}

export async function loader() {
  const response = await fetch('/api/categories');
  const categories = await response.json();
  return categories;
}
