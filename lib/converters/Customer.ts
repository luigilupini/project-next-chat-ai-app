import { db } from '@/firebase';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  doc,
} from 'firebase/firestore';

export interface Customer {
  email?: string | null;
  stripeId: string;
  stripeLink: string;
}

const customerConverter: FirestoreDataConverter<Customer> = {
  // 1) PUSH FROM FIRESTORE (toFirestore method): 🔥 This function is
  // responsible for transforming the object into a format that Firestore can
  // store. Here, we return an object that directly maps to the fields. You can
  // add any additional transformation or data sanitization logic as needed.
  toFirestore: function (customer: Customer): DocumentData {
    return {
      email: customer.email,
      stripeId: customer.stripeId,
      stripeLink: customer.stripeLink,
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
  ): Customer {
    const data = snapshot.data(options);

    return {
      email: data.email,
      stripeId: data.stripeId,
      stripeLink: data.stripeLink,
    };
  },
};

// 3) CONVERTERS (subscriptionRef function): 🔥 This function creates a Firestore
// collection reference for us, with the converter applied. This ensures that
// any data written to or read from this collection will be automatically
// transformed using the logic defined in the converter.
export const customerRef = (userId: string) =>
  doc(db, 'customers', userId).withConverter(customerConverter);
