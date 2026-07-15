import { useCallback, useState } from "react";
import { Alert } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001/api";

export type TSummary = {
  income: string;
  balance: string;
  expenses: string;
};

export const useTransactions = (userId: string) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<TSummary>({
    balance: "0",
    income: "0",
    expenses: "0",
  });

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await res.json();

      setTransactions(data);
    } catch (error) {
      console.log("Failed Fetch Transactions! ", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.log("Failed Fetch Summary! ", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      await Promise.allSettled([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.log("Error Loading Data! ", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSummary, fetchTransactions, userId]);

  const deleteTransaction = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete transaction!");

      loadData(); // Refresh Transactions and Summary
      Alert.alert("Success", "Transaction Deleted Successfully");
    } catch (error) {
      console.log("Failed deleting transaction! ", error);
      Alert.alert("Error", error as string);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
