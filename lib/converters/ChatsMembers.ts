import { db } from '@/firebase';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  collectionGroup,
  doc,
  query,
  where,
} from 'firebase/firestore';

export interface ChatMembers {
  userId: string;
  email: string;
  timestamp: Date | null;
  isAdmin: boolean;
  chatId: string;
  image: string;
}

export const chatMembersConverter: FirestoreDataConverter<ChatMembers> = {
  // 1) PUSH FROM FIRESTORE (toFirestore method): 🔥 This function is
  // responsible for transforming the object into a format that Firestore can
  // store. Here, we return an object that directly maps to the fields. You can
  // add any additional transformation or data sanitization logic as needed.
  toFirestore: function (member: ChatMembers): DocumentData {
    return {
      userId: member.userId,
      email: member.email,
      timestamp: member.timestamp,
      isAdmin: !!member.isAdmin,
      chatId: member.chatId,
      image: member.image,
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
  ): ChatMembers {
    const data = snapshot.data(options);

    return {
      userId: snapshot.id,
      email: data.email,
      timestamp: data.timestamp,
      isAdmin: data.isAdmin,
      chatId: data.chatId,
      image: data.image,
    };
  },
};

// 3) CONVERTERS (subscriptionRef function): 🔥 This function creates a Firestore
// collection reference for us, with the converter applied. This ensures that
// any data written to or read from this collection will be automatically
// transformed using the logic defined in the converter.
export const addChatRef = (chatId: string, userId: string) =>
  doc(db, 'chats', chatId, 'members', userId).withConverter(
    chatMembersConverter
  );

export const chatMembersRef = (chatId: string) =>
  collection(db, 'chats', chatId, 'members').withConverter(
    chatMembersConverter
  );

export const chatMemberAdminRef = (chatId: string) =>
  query(
    collection(db, 'chats', chatId, 'members'),
    where('isAdmin', '==', true)
  ).withConverter(chatMembersConverter);

export const chatMembersCollectionGroupRef = (userId: string) =>
  query(
    collectionGroup(db, 'members'),
    where('userId', '==', userId)
  ).withConverter(chatMembersConverter);
