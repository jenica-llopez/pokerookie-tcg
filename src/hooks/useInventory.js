import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db, ADMIN_UIDS } from '../firebase/config';
import { auth } from '../firebase/config';

function assertAdmin() {
  const user = auth.currentUser;
  if (!user || !ADMIN_UIDS.includes(user.uid)) {
    throw new Error('Unauthorized: admin only');
  }
}

export function useInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('dateAdded', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(docs);
        setLoading(false);
      },
      (err) => {
        console.error('Inventory listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const addItem = async (data, quantity = 1) => {
    assertAdmin();
    const base = {
      ...data,
      dateAdded: serverTimestamp(),
      dateSold: null,
      soldPrice: null,
      saleChannel: null,
      saleCurrency: null,
      saleNotes: null,
      shipmentId: null,
    };
    const promises = [];
    for (let i = 0; i < quantity; i++) {
      promises.push(addDoc(collection(db, 'items'), base));
    }
    await Promise.all(promises);
  };

  const updateItem = async (id, data) => {
    assertAdmin();
    const { id: _id, ...cleanData } = data;
    await updateDoc(doc(db, 'items', id), cleanData);
  };

  const deleteItem = async (id) => {
    assertAdmin();
    await deleteDoc(doc(db, 'items', id));
  };

  return { items, loading, error, addItem, updateItem, deleteItem };
}
