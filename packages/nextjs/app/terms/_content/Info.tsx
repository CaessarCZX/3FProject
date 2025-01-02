import React from "react";
import { IoMdArrowRoundForward } from "react-icons/io";

const Info: React.FC = () => {
  return (
    <div className="shadow-default mx-auto bg-white dark:bg-boxdark dark:border-strokedark rounded-lg p-6 px-12">
      <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">I. Introducción</h2>
      <p className="text-sm my-4 mb-8 pl-4">
        Este contrato establece los términos y condiciones (en adelante, &quot;Términos&quot;) aplicables al uso{" "}
        <strong className="dark:text-whiten">del contenido</strong> ofrecidos por 3F (Free Friends and Family) (en
        adelante, &quot;3F&quot;, &quot;nosotros&quot;, &quot;nuestro&quot;). Al registrarse y utilizar el{" "}
        <strong className="dark:text-whiten">contenido de este sitio</strong>, serás considerado parte de este grupo
        grupo exclusivo y limitado (en adelante llamado el <strong className="dark:text-whiten">integrante</strong>) y
        acepta cumplir y estar obligado por estos Términos.
      </p>
      <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">II. Definiciones</h2>
      <ol className="mt-8">
        <li className="ml-6">
          <p className="text-sm">
            1. <i>Aportación</i>: cantidad que realiza el Integrante al fondo común.
          </p>
        </li>
        <li className="ml-6">
          <p className="text-sm">
            2. <i>Fondo de Paz y Tranquilidad (PYT)</i>: el retorno de la aportación.
          </p>
        </li>
        <li className="ml-6">
          <p className="text-sm">
            3. <i>Beneficios</i>: se refiere a sus cantidades generadas después del retorno de la aportación.
          </p>
        </li>
        <li className="ml-6">
          <p className="text-sm">
            4. <i>Bonificación</i>: Compensación monetaria que se asigna al Integrante en los siguientes casos, por la
            afiliación de nuevos Integrantes a 3F, o por cada una de las aportaciones que realicen al fondo común
            conforme a lo establecido en este contrato privado o por un porcentaje de las aportaciones. Se desglosa a
            continuación los tipos de bonificaciones:
          </p>
          <div className="text-sm my-4 ml-24">
            a. <i>Pull de Organización</i>: la bonificación está compuesta por el 1% de las aportaciones de la comunidad
            del integrante, conforme a los requisitos establecidos.
          </div>
          <div className="text-sm my-4 ml-24">
            b. <i>Bono inmediato</i>: recompensas por la afiliación de nuevos Integrantes de la comunidad 3F, así como
            de las aportaciones del integrante conforme se describe en la cláusula VIII .
          </div>
        </li>
        <li className="ml-6">
          <p className="text-sm">
            5. <i>Integrante</i>: Persona de confianza, sea familia o amigo, que acepta los términos y condiciones
            establecidos en el presente contrato privado.
          </p>
        </li>
      </ol>
      <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">III. Aceptación de los términos</h2>
      <p className="text-sm my-4 mb-8 pl-4">
        Al utilizar las propuestas y herramientas de 3F, el Integrante acepta estos Términos en su totalidad. Si el
        Integrante no acepta estos Términos, debe abstenerse de utilizar el contenido del presente sitio.
      </p>
      <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">IV. Modificación de los términos</h2>
      <p className="text-sm my-4 mb-8 pl-4">
        3F se reserva el derecho a modificar estos Términos en cualquier momento. Los cambios se notificarán al
        Integrante a través del correo electrónico y/o aviso en el sitio web. La continuación en la utilización del
        contenido, sus herramientas y propuestas, tras la notificación de dichos cambios, constituirá la aceptación
        tácita de los mismos. (En caso de no aceptar los cambios, el integrante entiende que termina su relación con 3F)
      </p>
      <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">V. Requisitos de integración</h2>
      <p className="text-sm my-4  pl-4">
        Para ser parte del fondo privado 3F, el Integrante deberá abonar una membresía única de 500 USDT.
      </p>
      <p className="text-sm my-4 pl-4">
        Los integrantes ingresarán su(s) aportación(es) al fondo común; cada aportación será considerada de manera
        individual.
      </p>
      <p className="text-sm my-1 mb-8 pl-4">
        El fondo común la constituye la suma de todas las aportaciones de los integrantes, y estará limitado a un monto
        total de 10 millones de USDT.
      </p>
      <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">VI. Política de aportaciones y retiros</h2>
      <p className="text-sm my-4  pl-4">
        Cada nueva aportación del Integrante será retornada al 100% en un plazo de 10 meses a partir de su ingreso.
      </p>
      <p className="text-sm my-4 pl-4">
        El retorno se realiza en tres parcialidades: el primero, en el primer cuatrimestre, y dos pagos trimestrales.
      </p>
      <p className="text-sm my-1 mb-8 pl-4">
        A partir del retorno de su aportación que denominamos PYT, se ajustará al porcentaje del beneficio de acuerdo al
        monto ingresado, donde obtendrás{" "}
        <strong className="dark:text-whiten">entregas trimestrales de los beneficios compuestos</strong> del beneficios
        tienen tres categorías del 6%, 7% y 8% mensual compuesto al interior de cada trimestre de acuerdo a las
        aportaciones que se ingresan y entregan. La unidad de medida es en USDT de Ethereum.
      </p>
      <table className="m-auto w-full max-w-[350px]">
        <thead className="text-left dark:text-whiten">
          <tr>
            <th>Monto</th>
            <th>Porcentaje</th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          <tr>
            <td>2,000 - 4,500.00 USDT (ERC20)</td>
            <td>6%</td>
          </tr>
          <tr>
            <td>5,000 - 9,500.00 USDT (ERC20)</td>
            <td>7%</td>
          </tr>
          <tr>
            <td>10,000 + sin tope USDT (ERC20)</td>
            <td>8%</td>
          </tr>
        </tbody>
      </table>
      <p className="m-auto max-w-[350px] text-[10px] mb-8 mt-2 dark:text-whiten">
        Se pueden ingresar montos en múltiples de 500 USDT a partir de los 2 mil USDT.
      </p>
      <p className="text-sm my-1 mb-8 pl-4">
        El Integrante podrá retirar cada una de sus aportaciones y sus beneficios generados a partir del mes
        veinticuatro (24) de su fecha de ingreso correspondiente, solicitándolo con un mes de anticipación, a través del
        botón de retiro habilitado.
      </p>
      <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">VII. Pagos y beneficios</h2>
      <p className="text-sm my-4 mb-8 pl-4">
        Los beneficios de la aportación se entregarán trimestralmente, los días 1 y 16 de cada mes de acuerdo a la fecha
        de ingreso de la misma. La tasa mensual de los beneficios compuestos variará según la cantidad aportada.
      </p>
      <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">
        VIII. Bonificaciones y pull de organización
      </h2>
      <ol className="mt-8">
        <li className="ml-12 mb-4">
          <div className="flex">
            <strong className="pr-4 inline-block">1</strong>
            <div>Objetivo del Crecimiento:</div>
          </div>
          <p className="text-sm my-4 mb-8 pl-6">
            3F busca fomentar la sostenibilidad, estabilidad y tranquilidad a largo plazo, limitado al monto del fondo
            privado establecido.
          </p>
        </li>
        <li className="ml-12 mb-4">
          <div className="flex">
            <strong className="pr-4 inline-block">2</strong>
            <div>Tipos de Beneficios:</div>
          </div>
          <div className="flex pl-14 mt-4">
            <strong className="pr-4 inline-block">a.</strong>
            <div className="text-sm">
              <strong className="mr-1">Bono Inmediato:</strong>Disponible para todos los integrantes, se genera al pagar
              la membresía de un nuevo integrante y su aportación.
            </div>
          </div>
          <div className="flex ml-24 text-sm mt-4">
            <strong className="pr-4 inline-block">i</strong>
            <div>Pago de Membresía: $500 USDT; Bono inmediato: $100 USDT</div>
          </div>
          <div className="flex ml-24 text-sm mt-4">
            <strong className="pr-4 inline-block">ii</strong>
            <div>
              Integración de aportación: Se asigna un porcentaje de la aportación de acuerdo con los niveles de ingreso
              de $2,000 USDT en adelante:
            </div>
          </div>
          <ol className="text-[12px] w-fit mx-auto my-8">
            <li>
              <IoMdArrowRoundForward className="inline mr-2" />
              1er Nivel: 4%
            </li>
            <li>
              <IoMdArrowRoundForward className="inline mr-2" />
              2do Nivel: 2%
            </li>
            <li>
              <IoMdArrowRoundForward className="inline mr-2" />
              3er Nivel: 2%
            </li>
          </ol>
          <div className="flex pl-14 mt-4">
            <strong className="pr-4 inline-block">b.</strong>
            <div className="text-sm">
              <strong className="mr-1">Pull de Organización:</strong>es el bono residual del 1% del total de las
              aportaciones de la comunidad del integrante; se hará efectivo a partir del segundo mes después de la
              calificación. Todos los bonos del Pull de Organización se pagarán el día 16 de cada mes. Este bono
              residual es aplicable conforme a los requisitos que se establecen a continuación:
            </div>
          </div>
          <div className="flex ml-24 text-sm mt-4">
            <strong className="pr-4 inline-block">i</strong>
            <div>Desarrollar distintas líneas de ingreso respetando un volumen máximo por línea.</div>
          </div>
          <ol className="text-[12px] mx-auto my-8">
            <li>
              <IoMdArrowRoundForward className="inline mr-2" />
              Pulls 1-3: Distribución de montos acumulados: 40%, 30%, 20%, 10%.
            </li>
            <li>
              <IoMdArrowRoundForward className="inline mr-2" />
              Pulls 4 y 5: Distribución: 35%, 25%, 20%, 15%, 10%.
            </li>
          </ol>
          <div className="flex ml-24 text-sm mt-4">
            <strong className="pr-4 inline-block">ii</strong>
            <div>Bono según niveles del Pull de Organización:</div>
          </div>
          <ol className="text-[12px] mx-auto my-8">
            <li>
              <IoMdArrowRoundForward className="inline mr-2" />
              Pull 1: Volumen: $50,000 USDT; Bono: $500 USDT
            </li>
            <li>
              <IoMdArrowRoundForward className="inline mr-2" />
              Pull 2: Volumen: $150,000 USDT; Bono: $1,500 USDT
            </li>
            <li>
              <IoMdArrowRoundForward className="inline mr-2" />
              Pull 3: Volumen: $500,000 USDT; Bono: $5,000 USDT
            </li>
            <li>
              <IoMdArrowRoundForward className="inline mr-2" />
              Pull 4: Volumen: $1,000,000 USDT; Bono: $10,000 USDT
            </li>
            <li>
              <IoMdArrowRoundForward className="inline mr-2" />
              Pull 5: Volumen: $2,000,000 USDT; Bono: $20,000 USDT
            </li>
          </ol>
          <div className="flex ml-24 text-sm mt-4">
            <strong className="pr-4 inline-block">iii</strong>
            <div>No es necesario desarrollar rangos en una estructura jerárquica.</div>
          </div>
          <div className="flex ml-24 text-sm mt-4">
            <strong className="pr-4 inline-block">iv</strong>
            <div>Mantener la(s) aportación(es) personal(es) mínima(s) equivalente al bono a recibir.</div>
          </div>
          <div className="flex ml-24 text-sm mt-4">
            <strong className="pr-4 inline-block">v</strong>
            <div>Acceso a 7 niveles de acumulación al 100%.</div>
          </div>
        </li>
        <li className="ml-12 mb-4">
          <div className="flex">
            <strong className="pr-4 inline-block">3</strong>
            <div>Estabilidad de las Reglas</div>
          </div>
          <p className="text-sm my-4 mb-8 pl-6">
            Las reglas del Pull de Organización están diseñadas para ser estables y sostenibles, y no se anticipan
            cambios. Esto proporciona a los integrantes la confianza de que estos ingresos serán una fuente adicional en
            sus finanzas mientras el mercado lo permita.
          </p>
        </li>
      </ol>
      <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">
        IX. Responsabilidad y limitación de responsabilidad
      </h2>
      <p className="text-sm my-4 mb-8 pl-4">
        3F no será responsable por daños directos, indirectos, incidentales o consecuentes que surjan en relación a las
        llaves de acceso de los Integrantes, y al contenido de este sitio web. El Integrante asume el riesgo asociado
        las aplicaciones informáticas contenidas en el presente sitio.
      </p>
      <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">X. Confidencialidad y protección</h2>
      <p className="text-sm mt-4 mb-8 pl-4">
        Se asegura la protección de datos personales de los Integrantes conforme a la legislación vigente sobre
        protección de datos; y su uso es exclusivo para fines de este contrato privado.
      </p>
      <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">XI. Solución de controversias</h2>
      <ol className="mt-8">
        <li className="ml-12">
          <div>
            <strong className="pr-4">A</strong>Mediación.
          </div>
          <p className="text-sm">
            En caso de surgir cualquier controversia, disputa o reclamación relacionada con este contrato, las partes se
            comprometen a intentar resolver la controversia en primer lugar mediante mediación amistosa. La mediación se
            llevará a cabo de acuerdo con las reglas de mediación de la institución correspondiente dentro de un plazo
            de 30 días a partir de la notificación por escrito de la controversia por la parte que la invoque.
          </p>
        </li>
        <li className="ml-12">
          <div>
            <strong className="pr-4">B.</strong>Arbitraje.
          </div>
          <p className="text-sm">
            Si las partes no logran resolver la controversia a través de mediación dentro de los 30 días mencionados, la
            controversia se resolverá mediante arbitraje vinculante de conformidad con las disposiciones vigentes.
          </p>
        </li>
      </ol>
      <h2 className="text-2xl font-light text-gray-800 dark:text-whiten">XII. Disposiciones finales</h2>
      <p className="text-sm mt-4 mb-4 pl-4">
        Si alguna disposición de estos Términos se considera inválida o inaplicable, las disposiciones restantes
        seguirán en pleno vigor. Este contrato privado constituye el acuerdo completo entre las partes.
      </p>
      <p className="text-sm mt-4 mb-8 pl-4">
        Manifiestan los integrantes ante 3F que, en el presente contrato privado, existe buena fe de las partes, hay
        consentimiento expreso de aceptación en todo su contenido, no existe error, dolo, ni enriquecimiento ilícito o
        violencia alguna, por lo que, desde ahora, renuncian a promover su nulidad, por esas causas previstas en el
        legislación Civil aplicable.
      </p>
      <h2 className="text-2xl font-medium text-gray-800 dark:text-whiten">Firmado</h2>
      <div className="my-4">
        <button className="px-4 py-2 rounded-md bg-primary dark:bg-blue-500 text-whiten font-medium text-base">
          Aceptar
        </button>
      </div>
      <p className="text-[12px] mt-4 mb-4">
        Por favor, el Integrante confirma haber leído y aceptado los Términos y Condiciones al registrarse en 3F.
      </p>
    </div>
  );
};

export default Info;
