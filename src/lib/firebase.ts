import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

export const PORTFOLIO_DOC_PATH = {
  collection: 'portfolio_data',
  id: 'live_content'
};

export { doc, getDoc, setDoc, onSnapshot };
