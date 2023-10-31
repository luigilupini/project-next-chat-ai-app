import { db } from '@/firebase';

import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { User } from 'next-auth';

// 🔥 FIRESTORE DATA CONVERTER & HELPER FUNCTIONS
const userConverter: FirestoreDataConverter<User> = {
  // 1) PUSH FROM FIRESTORE (toFirestore method): 🔥 This function is
  // responsible for transforming the object into a format that Firestore can
  // store. Here, we return an object that directly maps to the fields. You can
  // add any additional transformation or data sanitization logic as needed.
  toFirestore: function (customer: User): DocumentData {
    return {
      email: customer.email,
      image: customer.image,
      name: customer.name,
      // ... other fields
    };
  },
  // 2) PULL FROM FIRESTORE (fromFirestore method): 🔥 This function converts
  // the raw data from Firestore into a object that our application can work
  // with directly. Here, we're extracting each field from the Firestore data,
  // and constructing a object that matches our application's data structure.
  // Transform logic as needed like converting timestamps to Date etc.
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      email: data.email,
      image: data.image,
      name: data.name,
      // ... other fields
    };
  },
};

// 3) CONVERTER (helper function): 🔥 This function creates a Firestore
// collection reference for us, with the converter applied. This ensures that
// any data written to or read from this collection will be automatically
// transformed using the logic defined in the converter.
export const getUserByEmailRef = (email: string) =>
  query(collection(db, 'users'), where('email', '==', email)).withConverter(
    userConverter
  );
