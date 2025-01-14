import { useCallback, useState } from "react";
import { useGlobalState } from "~~/services/store/store";
import { fetchMemberSavings } from "~~/utils/Transactions/fetchMemberSavings";

// import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export const useGetMemberSavings = () => {
  const setIsMemberSavingsFetching = useGlobalState(state => state.setIsMemberSavingsFetching);
  const setMemberSavings = useGlobalState(state => state.setMemberSavings);
  const setMemberBalance = useGlobalState(state => state.setMemberBalance);
  const [errorRequest, setErrorRequest] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchSavings = useCallback(
    async (currentPage: number) => {
      setIsMemberSavingsFetching(true);

      const { page, pages, memberSavings, balance, error } = await fetchMemberSavings(currentPage);

      if (error) {
        setIsMemberSavingsFetching(false);
        setErrorRequest(error);
        return;
      }

      if (page) setPage(page);
      if (pages) setPages(pages);
      if (memberSavings) setMemberSavings(memberSavings);
      if (balance) setMemberBalance(balance);

      setIsMemberSavingsFetching(false);
    },
    [setIsMemberSavingsFetching, setMemberBalance, setMemberSavings],
  );

  return { page, pages, fetchSavings, error: errorRequest };
};
