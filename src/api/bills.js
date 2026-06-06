// Firestore helpers for bills
import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebase.config';

// Collection names
export const MANUAL_BILLS_COLLECTION = 'universal-carwash-manual-bills';
export const BILLS_COLLECTION = 'bills';

// Save a manual bill (idempotent by id)
export async function saveManualBill(billId, data) {
  if (!billId) throw new Error('billId is required');
  const ref = doc(db, MANUAL_BILLS_COLLECTION, billId);
  const existing = await getDoc(ref);
  if (existing.exists()) return { id: billId, alreadyExists: true };
  await setDoc(ref, { ...data, createdAt: new Date().toISOString(), source: 'manual' });
  return { id: billId, alreadyExists: false };
}

// Subscribe to combined bills (manual + auto), newest first by date/serviceDate
export function subscribeToBills(onChange, onError) {
  const q1 = query(collection(db, BILLS_COLLECTION));
  const q2 = query(collection(db, MANUAL_BILLS_COLLECTION));

  let billsA = [];
  let billsB = [];

  const toMillis = (value) => {
    try {
      if (!value) return 0;
      if (value?.toDate) return value.toDate().getTime();
      if (typeof value === 'number') return value;
      const d = new Date(value);
      const t = d.getTime();
      return isNaN(t) ? 0 : t;
    } catch (_) {
      return 0;
    }
  };

  const mergeAndEmit = () => {
    const merged = [...billsA, ...billsB].sort((a, b) => {
      const aTime = toMillis(a.createdAt || a.date || a.serviceDate || 0);
      const bTime = toMillis(b.createdAt || b.date || b.serviceDate || 0);
      return bTime - aTime;
    });
    onChange(merged);
  };

  const unsubA = onSnapshot(
    q1,
    (snap) => {
      billsA = snap.docs.map((d) => ({ id: d.id, ...d.data(), source: d.data()?.source || 'auto' }));
      mergeAndEmit();
    },
    onError
  );

  const unsubB = onSnapshot(
    q2,
    (snap) => {
      billsB = snap.docs.map((d) => ({ id: d.id, ...d.data(), source: 'manual' }));
      mergeAndEmit();
    },
    onError
  );

  return () => {
    unsubA();
    unsubB();
  };
}

// Delete a bill from the proper collection
export async function deleteBill(bill) {
  if (!bill?.id) throw new Error('Bill id is required');
  const isManual = bill?.source === 'manual';
  const collectionName = isManual ? MANUAL_BILLS_COLLECTION : BILLS_COLLECTION;
  await deleteDoc(doc(db, collectionName, bill.id));
}
