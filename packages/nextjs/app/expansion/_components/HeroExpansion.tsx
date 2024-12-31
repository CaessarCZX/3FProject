"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";

interface CardItem {
  count: string;
  title: string;
}

type CardItemProps = {
  item: CardItem;
};

const CardItemComponent: React.FC<CardItemProps> = ({ item }) => (
  <>
    <h3 className="text-2xl md:text-4xl font-black mb-2">{item.count}</h3>
    <h5 className="text-md font-medium opacity-80">{item.title}</h5>
  </>
);

export const SubscribeForm = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/whiteList/create-white-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          isApproved: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 && data.redirect) {
          setSuccess(true);
          return;
        }

        setError(data.message || "Ocurrió un error inesperado");
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h3 className="text-lg font-medium text-gray-700">Agregar Referido</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Correo</label>
        <div className="flex max-h-13 gap-4 mt-2">
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Correo de nuevo referido"
            className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-md shadow focus:outline-none min-w-55 ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Guardando..." : "Crear referido"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">Referido agregado exitosamente</p>}
      </div>
    </form>
  );
};

const HeroExpansion: React.FC = () => {
  const currentMember = useAccount();
  const { data: totalAffiliates } = useScaffoldReadContract({
    contractName: "FFFBusiness",
    functionName: "getTotalAffiliatesPerMember",
    args: [currentMember?.address],
  });

  const affiliates = `${Number(totalAffiliates || 0)}`;

  const AffiliatesStats = [
    {
      count: affiliates,
      title: "Tus afiliados",
    },
    {
      count: "0%",
      title: "Crecimiento mensual",
    },
    {
      count: "641",
      title: "P.V",
    },
    {
      count: "313",
      title: "P.V para alcanzar rango",
    },
  ];

  return (
    <section className="mb-8 py-4 bg-white shadow-default rounded-md dark:border-strokedark dark:bg-boxdark text-zinc-900 dark:text-white">
      <div className="container px-4 mx-auto">
        <div className="flex items-center text-center max-w-6xl mx-auto space-x-8">
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 opacity-80 max-w-4xl mx-auto">
            Puedes dar seguimiento a tu organización, verifica el crecimiento de tus afiliados
          </p>
        </div>
        <div className="z-9 grid grid-cols-12 gap-6 max-w-7xl mx-auto text-center mt-4">
          {AffiliatesStats.map((item, i) => (
            <div className="col-span-3" key={i}>
              <CardItemComponent item={item} />
            </div>
          ))}
        </div>

        <SubscribeForm />
      </div>
    </section>
  );
};

export default HeroExpansion;
