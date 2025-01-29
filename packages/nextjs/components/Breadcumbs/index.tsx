import Link from "next/link";

interface BreadcrumbProps {
  pageName: string;
  fromPage?: string;
}
const Breadcrumb = ({ pageName, fromPage = "Inicio" }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-3xl font-medium text-black dark:text-white">{pageName}</h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-normal text-base" href="/home">
              {`${fromPage} /`}
            </Link>
          </li>
          <li className="font-light text-primary">{`Sección de ${pageName}`}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
