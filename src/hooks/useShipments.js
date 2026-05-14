import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy
} from 'firebase/firestore';
import { db, ADMIN_UIDS } from '../firebase/config';
import { auth } from '../firebase/config';

function assertAdmin() {
  const user = auth.currentUser;
  if (!user || !ADMIN_UIDS.includes(user.uid)) {
    throw new Error('Unauthorized: admin only');
  }
}

export function useShipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'shipments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setShipments(docs);
        setLoading(false);
      },
      (err) => {
        console.error('Shipments listener error:', err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const addShipment = async (data) => {
    assertAdmin();
    await addDoc(collection(db, 'shipments'), { ...data, createdAt: new Date() });
  };

  const updateShipment = async (id, data) => {
    assertAdmin();
    const { id: _id, ...cleanData } = data;
    await updateDoc(doc(db, 'shipments', id), cleanData);
  };

  const deleteShipment = async (id) => {
    assertAdmin();
    await deleteDoc(doc(db, 'shipments', id));
  };

  return { shipments, loading, addShipment, updateShipment, deleteShipment };
}
