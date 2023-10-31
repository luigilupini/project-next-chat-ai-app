import { db } from '@/firebase';
import { Subscription } from '@/types/Subscription';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
} from 'firebase/firestore';

// 🔥 FIRESTORE DATA CONVERTER & HELPER FUNCTIONS
const subscriptionConverter: FirestoreDataConverter<Subscription> = {
  // 1) PUSH FROM FIRESTORE (toFirestore method): 🔥
  // This function is responsible for transforming the subscription object
  // into a format that Firestore can store. Here, we return an object that
  // directly maps to the subscription fields. You can add any additional
  // transformation or data sanitization logic as needed.
  toFirestore: function (subscription: Subscription): DocumentData {
    return {
      ...subscription,
      // ... other fields
    };
  },
  // 2) PULL FROM FIRESTORE (fromFirestore method): 🔥
  // This function converts the raw data from Firestore into a Subscription
  // object that our application can work with directly. Here, we're extracting
  // each field from the Firestore data, and constructing a Subscription object
  // that matches our application's data structure. You can add any additional
  // transformation logic as needed, such as converting timestamps to Date etc.
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Subscription {
    const data = snapshot.data(options);

    const sub: Subscription = {
      id: snapshot.id,
      cancel_at_period_end: data.cancel_at_period_end,
      created: data.created,
      current_period_start: data.current_period_start,
      items: data.items,
      latest_invoice: data.latest_invoice,
      metadata: data.metadata,
      payment_method: data.payment_method,
      price: data.price,
      prices: data.prices,
      product: data.product,
      quantity: data.quantity,
      status: data.status,
      stripeLink: data.stripeLink,
      cancel_at: data.cancel_at,
      canceled_at: data.canceled_at,
      current_period_end: data.current_period_end,
      ended_at: data.ended_at,
      trial_start: data.trial_start,
      trial_end: data.trial_end,
      role: data.role,
      // ... other fields
    };
    return sub;
  },
};

// 3) CONVERTER (helper function): 🔥 This function creates a Firestore
// collection reference for a user's subscriptions, with subscriptionConverter
// applied. This ensures that any data written to or read from this collection
// will be transformed using the logic defined in the subscriptionConverter.
export const subscriptionRef = (userId: string) =>
  collection(db, 'customers', userId, 'subscriptions').withConverter(
    subscriptionConverter
  );
