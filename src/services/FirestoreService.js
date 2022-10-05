const { firestore } = require('../lib/firebase');
const { FORMS } = require('../shared/constants/forms');
const Logger = require('../shared/Logger');

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
      Logger.log('No such document!');

      return null;
    } else {
      Logger.log('Document data:', document.data());

      return document.data();
    }
  }

  getCompound(collection, compoundQueries) {
    // const collectionReference = firestore.collection(collection);

    // collectionReference.where('state', '>=', 'CA').where('state', '<=', 'IN');

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

  async updateOne(collection, id, data) {
    const collectionReference = firestore.collection(collection).doc(id);
    const res = await collectionReference.update(data);

    return true
  }
}

const getFileNameById = (value) => {
  return Object.keys(FORMS).find((key) => FORMS[key] === value);
};

const getListOfFilesWithErrors = (errors) => {
  return Object.keys(errors).filter((id) => errors[id] === null).map((id) => getFileNameById(id));
};


module.exports = {
  FirestoreService,
  getListOfFilesWithErrors
};
