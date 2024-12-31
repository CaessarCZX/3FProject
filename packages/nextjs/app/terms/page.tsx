import Link from "next/link";
import { NextPage } from "next";
import Breadcrumb from "~~/components/Breadcumbs";
import InternalLayout from "~~/components/Layouts/InternalLayout";

// import CardDataStats from "~~/components/UI/CardDataStats";

const Terms: NextPage = () => {
  return (
    <InternalLayout>
      <Breadcrumb pageName="Términos y Condiciones" />
      <div className="shadow-default mx-auto bg-white dark:bg-boxdark dark:border-strokedark rounded-lg p-6 px-12">
        <h2 className="text-3xl font-light text-gray-500 dark:text-gray-300">Aceptación de los términos</h2>

        <p className="my-4 mb-8 text-gray-400">
          La presente página web proporciona un resumen informativo de los términos y condiciones de uso. El documento
          la utilización de esta aplicación/sitio web está disponible para su consulta y descarga a través de los los
          los enlaces ubicados en el pie de página de este sitio.
        </p>
        <p className="my-4 mb-8">
          Al utilizar las propuestas y herramientas de 3F, el Integrante acepta estos Términos en su totalidad. Si el
          Integrante no acepta estos Términos, debe abstenerse de utilizar el contenido del presente sitio.
        </p>
        <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">Modificación de los términos</h2>
        <p className="text-sm my-4 mb-8 pl-4">
          3F se reserva el derecho a modificar estos Términos en cualquier momento. Los cambios se notificarán al
          Integrante a través del correo electrónico y/o aviso en el sitio web. La continuación en la utilización del
          contenido, sus herramientas y propuestas, tras la notificación de dichos cambios, constituirá la aceptación
          tácita de los mismos. (En caso de no aceptar los cambios, el integrante entiende que termina su relación con
          3F)
        </p>
        <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">
          Responsabilidad y limitación de responsabilidad
        </h2>
        <p className="text-sm my-4 mb-8 pl-4">
          3F no será responsable por daños directos, indirectos, incidentales o consecuentes que surjan en relación a
          las llaves de acceso de los Integrantes, y al contenido de este sitio web. El Integrante asume el riesgo
          asociado las aplicaciones informáticas contenidas en el presente sitio.
        </p>
        <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">Confidencialidad y protección</h2>
        <p className="text-sm mt-4 mb-8 pl-4">
          Se asegura la protección de datos personales de los Integrantes conforme a la legislación vigente sobre
          protección de datos; y su uso es exclusivo para fines de este contrato privado.
        </p>
        <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">Solución de controversias</h2>
        <ol className="mt-8">
          <li className="ml-12">
            <div>
              <strong className="pr-4">A</strong>Mediación.
            </div>
            <p className="text-sm">
              En caso de surgir cualquier controversia, disputa o reclamación relacionada con este contrato, las partes
              se comprometen a intentar resolver la controversia en primer lugar mediante mediación amistosa. La
              mediación se llevará a cabo de acuerdo con las reglas de mediación de la institución correspondiente
              dentro de un plazo de 30 días a partir de la notificación por escrito de la controversia por la parte que
              la invoque.
            </p>
          </li>
          <li className="ml-12">
            <div>
              <strong className="pr-4">B.</strong>Arbitraje.
            </div>
            <p className="text-sm">
              Si las partes no logran resolver la controversia a través de mediación dentro de los 30 días mencionados,
              la controversia se resolverá mediante arbitraje vinculante de conformidad con las disposiciones vigentes.
            </p>
          </li>
        </ol>
        <h2 className="text-2xl font-medium text-gray-800 dark:text-whiten">Enlaces de importancia</h2>
        <Link className="text-primary underline mt-8" href="#">
          CONTRATO DE TÉRMINOS Y CONDICIONES DE USO DE 3F
        </Link>
      </div>
    </InternalLayout>
  );
};

export default Terms;
