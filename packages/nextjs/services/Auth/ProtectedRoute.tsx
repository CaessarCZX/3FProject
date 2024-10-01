"use client";

import { ComponentType } from "react";

// import { useRouter } from "next/navigation";
// import { useAccount } from "wagmi";
// import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function ProtectedRoute(Outlet: ComponentType): ComponentType {
  return function ProtectedRoute(props: any) {
    // const router = useRouter();
    // const currentMember = useAccount();

    // const { data: isActiveMember } = useScaffoldReadContract({
    //   contractName: "FFFBusiness",
    //   functionName: "isCurrentlyActiveUser",
    //   args: [currentMember?.address],
    // });
    // useEffect(() => {
    //   if (isActiveMember == false || isActiveMember == undefined) router.push("/");
    //   console.log(isActiveMember);
    // }, []);

    // if (isActiveMember == undefined) return null;

    return <Outlet {...props} />;
  };
}
