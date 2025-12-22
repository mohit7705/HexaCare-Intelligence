import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveHistory = async (
  uid: string,
  toolId: string,
  toolName: string,
  input: any,
  result: any
) => {
  await addDoc(
    collection(db, "users", uid, "history"),
    {
      toolId,
      toolName,
      input,
      result,
      createdAt: serverTimestamp(),
    }
  );
};
