/*there are several libraries in firebase but we only need firebase auth and firestore 
but in any case we always have to import basic firebase library first */

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";


/*this is the config object we get from firebase when we setup our project on firebase */

const config = {
  apiKey: "AIzaSyCUj1uBXAJaMlh12pLRFWe8dg7-OiCHHls",
  authDomain: "clothorama-e4816.firebaseapp.com",
  projectId: "clothorama-e4816",
  storageBucket: "clothorama-e4816.appspot.com",
  messagingSenderId: "471947571567",
  appId: "1:471947571567:web:b0c3247f24fbce93beb89a",
  measurementId: "G-0FDVETFJ9X"
};

//async because we are making an api request
export const createUserProfileDocument = async (userAuth, additionalData) => {
  // if the userAuth object is null that is the user is not signed-In then we return from the function.

  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    //we can only call set get update and delete method on userRef and not on snapshot because snapshot is just representing data.

    try {
      userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};

/*one time used function to add our shop data to firestore */
export const addCollectionsAndDocuments = async (collectionKey,ObjectToAdd) => {

  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();

  ObjectToAdd.forEach(obj => {
    
    const newDocRef = collectionRef.doc();

    batch.set(newDocRef,obj);

  });

  //batch.commit returns a promise if its successful it would resolve a void value
 return await batch.commit();

}

/*this function accepts firestore data and modifies data, so that we can continue to use it in our application */
export const createCollectionsSnapshotToMap=(collection) =>{

  /*Here we are getting that array of objects from firestore => we updated each object to have the properties we wanted */
 const transformedCollection= collection.docs.map(doc =>{

    const {title, items} = doc.data();

    return{
      title,
      items,
      id:doc.id,
      routeName: encodeURI(title.toLowerCase())
    };

  });

  /*Now we want to convert this array of objects to object of objects so that we can easily navigate and get the data*/
  /*Objects are easy to fetch data from compared to array */

 return transformedCollection.reduce((accumulator,currentCollection)=>{

    accumulator[currentCollection.title.toLowerCase()] = currentCollection;

    return accumulator;

  },{});


}


/*understand the code  */
firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
