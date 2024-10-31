// import { useEffect } from "react";
// import { useGlobalState } from "~~/services/store/store";

// export const useInitializeMemberStatus = () => {
//   const setIsActiveMemberStatus = useGlobalState(state => state.setIsActiveMemberStatus);
//   const setIsMemberStatusFetching = useGlobalState(state => state.setIsMemberStatusFetching);

//   const { data: checkActiveMember } = useScaffoldReadContract({
//     contractName: "FFFBusiness",
//     functionName: "checkActiveMember",
//     args: ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"],
//   });

//   const getCurrentMemberStatus = () => {
//     setIsMemberStatusFetching(true);

//   }

//   useEffect(() => {
//     getCurrentMemberStatus();
//   }, []);
// };
