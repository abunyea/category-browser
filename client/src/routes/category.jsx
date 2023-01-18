import { Link, useLoaderData } from 'react-router-dom';

export default function Category() {
  const category = useLoaderData();
  return (
    <>
      <Link to='edit'>Edit</Link>
      <p>Name: {category.displayName}</p>
      <p>Alternate names: {category.alternateNames}</p>
      <p>Description: {category.description}</p>
      Parents
      <ul>
        {category.parents.map((parent) =>
          <li key={parent.conceptId}><Link to={`/categories/${parent.conceptId}`}>{parent.displayName}</Link></li>
        )}
      </ul>
      Children
      <ul>
        {category.children.map((child) =>
          <li key={child.conceptId}><Link to={`/categories/${child.conceptId}`}>{child.displayName}</Link></li>
        )}
      </ul>
    </>
  );
}

export async function loader({ params }) {
  const response = await fetch(`/api/categories/${params.conceptId}`);
  const category = await response.json();
  return category;
}
