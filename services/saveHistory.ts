import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * 🔒 Firestore-safe sanitizer
 * - Removes undefined
 * - Converts NaN → null
 * - Recursively cleans objects
 */
const sanitize = (value: any): any => {
  if (value === undefined) return null;
  if (typeof value === "number" && Number.isNaN(value)) return null;

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (typeof value === "object" && value !== null) {
    const cleaned: any = {};
    for (const key in value) {
      const v = sanitize(value[key]);
      if (v !== undefined) {
        cleaned[key] = v;
      }
    }
    return cleaned;
  }

  return value;
};

export const saveHistory = async (
  uid: string,
  toolId: string,
  toolName: string,
  input: any,
  result: any
) => {
  try {
    await addDoc(collection(db, "users", uid, "history"), {
      toolId,
      toolName,
      input: sanitize(input),
      result: sanitize(result),
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    // ❌ DO NOT crash UI for history failure
    console.warn("⚠️ History save skipped (invalid data):", err);
  }
};
