import { db } from '@/firebase';
import { LanguagesSupported } from '@/store/store';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
}

export interface Message {
  id?: string;
  input: string;
  timestamp: Date;
  user: User;
  translated?: {
    [K in LanguagesSupported]?: string;
  };
  // ... other fields
}

// 🔥 FIRESTORE DATA CONVERTER & HELPER FUNCTIONS
const messageConverter: FirestoreDataConverter<Message> = {
  // 1) PUSH FROM FIRESTORE (toFirestore method): 🔥 This function is
  // responsible for transforming the object into a format that Firestore can
  // store. Here, we return an object that directly maps to the fields. You can
  // add any additional transformation or data sanitization logic as needed.
  toFirestore: function (message: Message): DocumentData {
    return {
      input: message.input,
      timestamp: message.timestamp,
      user: message.user,
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
  ): Message {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      input: data.input,
      timestamp: data.timestamp?.toDate(),
      translated: data.translated,
      user: data.user,
      // ... other fields
    };
  },
};

// 3) CONVERTERS (helper functions): 🔥 This function creates a Firestore
// collection reference for us, with the converter applied. This ensures that
// any data written to or read from this collection will be automatically
// transformed using the logic defined in the converter.
export const messagesRef = (chatId: string) =>
  collection(db, 'chats', chatId, 'messages').withConverter(messageConverter);

export const limitedMessagesRef = (chatId: string) =>
  query(messagesRef(chatId), limit(25));

export const sortedMessagesRef = (chatId: string) =>
  query(messagesRef(chatId), orderBy('timestamp', 'asc'));

export const limitedSortedMessagesRef = (chatId: string) =>
  query(query(messagesRef(chatId), limit(1)), orderBy('timestamp', 'desc'));
