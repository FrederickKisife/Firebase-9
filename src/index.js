import {initializeApp} from 'firebase/app'
import{
    getFirestore, collection,getDocs, 
    addDoc, deleteDoc, doc, onSnapshot,
    query, where, orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore'
import{
    getAuth,createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
}from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyD1tHrRJGIY2d9YutFYWcaa64UmlML_lGM",
    authDomain: "fir-9-8dfcc.firebaseapp.com",
    projectId: "fir-9-8dfcc",
    storageBucket: "fir-9-8dfcc.appspot.com",
    messagingSenderId: "987032370177",
    appId: "1:987032370177:web:cb0aa5e3c6f0027069d400"
  };

  // init firebase app
  initializeApp(firebaseConfig)
  const auth = getAuth()

  // init services
  const db = getFirestore()

  // collection ref
  const colRef = collection(db, 'books')

  // queries
  const q = query(colRef, orderBy('createdAt'))

  //real time collection data
    onSnapshot(q, (snapshot)=>{
        let books =[];
        snapshot.docs.forEach((doc)=>{
            books.push({...doc.data(), id: doc.id})
        })
        console.log(books);
    })

    //adding documents
    const addBookForm = document.querySelector(".add")
    addBookForm.addEventListener('submit', (e)=>{
        e.preventDefault()

        addDoc(colRef, {
            title: addBookForm.title.value,
            author: addBookForm.author.value,
            createdAt:serverTimestamp()
        })
        .then(()=>{
            addBookForm.reset()
        })
    })

    // deleting documents
    const deleteBookForm = document.querySelector('.delete')
    deleteBookForm.addEventListener('submit', (e)=>{
        e.preventDefault()

        const docRef = doc(db, 'books',deleteBookForm.id.value)

        deleteDoc(docRef)
        .then(() =>{
            deleteBookForm.reset()
        })
    })

    //get a single document
    const docRef = doc(db,'books','wSeSqwnRq4BggxmMMuF4')
   

    onSnapshot(docRef, (doc)=>{
        console.log(doc.data(), doc.id);
    })

    // updating a document
    const updateForm = document.querySelector('.update');
    updateForm.addEventListener("submit", e=>{
        e.preventDefault()

        const docRef = doc(db, 'books', updateForm.id.value)

        updateDoc(docRef, {
            title: 'updated title'
        })
        .then(()=>{
            updateForm.reset()
        })
    })

    // signing up users
    const signupForm = document.querySelector(".signup")
    signupForm.addEventListener('submit', e=>{
        e.preventDefault()

        const email = signupForm.email.value
        const password = signupForm.password.value

        createUserWithEmailAndPassword(auth,email,password)
        .then((cred)=>{
            console.log("user created :", cred.user);
            signupForm.reset()
        })
        .catch((err)=>{
            console.log(err.message);
        })
    })

    // logging in and out
    const logoutButton = document.querySelector(".logout")
    logoutButton.addEventListener('click', ()=>{
      signOut(auth)
      .then(()=>{
        // console.log("User loggedout out");
      }) 
      .catch((err)=>{
        console.log(err.message);
      }) 
    })

    const loginForm = document.querySelector(".login")
    loginForm.addEventListener('submit', (e)=>{
        e.preventDefault()

        const email = loginForm.email.value
        const password = loginForm.password.value

        signInWithEmailAndPassword(auth,email,password)
        .then((cred)=>{
            // console.log('User logged in : ', cred.user);
            loginForm.reset()
        })
        .catch((err)=> console.log(err.message))
    })

    // subscribing to auth changes

    onAuthStateChanged(auth, (user) =>{
        console.log('user status changed:', user);
    })