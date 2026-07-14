export type TPostTransaction = {
  user_id: string;
  title: string;
  category: "income" | "expense";
  amount: number;
};
