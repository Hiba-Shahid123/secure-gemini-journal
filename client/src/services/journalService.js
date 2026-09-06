import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase";

// Save a journal entry
export const saveJournalEntry = async (userId, text) => {
  const entriesRef = collection(db, "journalEntries");

  await addDoc(entriesRef, {
    userId: userId,
    text: text,
    createdAt: serverTimestamp()
  });
};

// Get journal entries for the logged-in user
export const getJournalEntries = async (userId) => {
  const entriesRef = collection(db, "journalEntries");

  const q = query(
    entriesRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};