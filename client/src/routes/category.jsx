import { Link, useLoaderData } from 'react-router-dom';

export default function Category() {
  const category = useLoaderData();
  return (
    <>
      <p>Name: {category.displayName}</p>
      <p>Alternate names: {category.alternateNames}</p>
      <p>Description: {category.description}</p>
      Parents
      <ul>
        {category.parents.map((parent) =>
          <li><Link to={`/categories/${parent.conceptId}`}>{parent.displayName}</Link></li>
        )}
      </ul>
      Children
      <ul>
        {category.children.map((child) =>
          <li><Link to={`/categories/${child.conceptId}`}>{child.displayName}</Link></li>
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
