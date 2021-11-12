const { firestore } = require('../lib/firebase');
const { FORMS } = require('./../shared/constants/forms')

class FirestoreService {
  /**
   *
   * @param {string} collection
   * @param {string} id
   * @param {Object} data
   */
  async create(collection, id, data) {
    const collectionReference = firestore.collection(collection);
    const item = await collectionReference.doc(id).set(data, { merge: true });

    return item;
  }

  async getOne(collection, id) {
    const collectionReference = firestore.collection(collection);
    const documentReference = collectionReference.doc(id)
    const document = await documentReference.get()

    if (!document.exists) {
      console.log('No such document!');

      return null;
    } else {
      console.log('Document data:', document.data());

      return document.data();
    }
  }

  async getAll(collection) {
    if (!collection) {
      throw new Error('collection has not been sent. ❌');
    }

    const collectionReference = firestore.collection(collection);
    const records = await collectionReference.get();

    return records;
  }

  async deleteCollection(collection) {
    if (!collection) {
      throw new Error('collection has not been sent. ❌');
    }

    const collectionReference = firestore.collection(collection);
    const snapshot = await collectionReference.get();
    const collectionSize = snapshot.size;

    if (collectionSize === 0) {
      return Promise.resolve(collection);
    }

    const batch = firestore.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    process.nextTick(() => {
      this.deleteCollection(collection);
    });
  }
}

const getListOfFilesWithErrors = (errors) => {
  return Object.keys(errors).filter((id) => errors[id] === null).map((id) => getFileNameById(id))
}

const getFileNameById = (value) => {
  return Object.keys(FORMS).find(key => FORMS[key] === value);
}


module.exports = {
  FirestoreService,
  getListOfFilesWithErrors
};
