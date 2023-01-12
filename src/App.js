import React, { useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { app, database, storage } from "./appfirebaseconfig";
//for database
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot, // used in Real Time
  // firebase firestore queries
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fileData, setFileData] = useState("");
  // For Google
  const provider = new GoogleAuthProvider();
  // For GitHub
  const githubprovider = new GithubAuthProvider();
  // For create A collection caled user
  const collectionRef = collection(database, "user");
  //for auth
  const auth = getAuth();
  // For query
  const ageQuery = query(collectionRef, where("age", "<", 20));

  const data = {
    email: "agmed@gmail.com",
    password: "123456",
  };

  // First Thing is Create User and Password
  const createUserandPassword = () => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((res) => {
        console.log(res.user);
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  // to sign In
  const signIn = () => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        console.log(userCredential.user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
  // To sign in With Your Google Account
  const googleSign = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        console.log(res.user);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  // first open  your github Account
  //open Seeting
  //open Developer setting
  //open OuthApp
  const gitHubSign = () => {
    signInWithPopup(auth, githubprovider)
      .then((res) => {
        console.log(res.user);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const addDataToDatabase = () => {
    addDoc(collectionRef, { email: data.email, password: data.password })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const getAllDataToDatabase = () => {
    getDocs(collectionRef).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(newData);
    });
  };

  const updateDataToDatabase = () => {
    const docToUpdate = doc(database, "user", "BoRSwTnhUmhmZ04qcuWN");
    //you cand updated Email only or password only or together
    updateDoc(docToUpdate, { email: "alaa@yahoo.com", password: "123456789" })
      .then((res) => {
        alert("data Updated");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const deleteDataToDatabase = () => {
    const docToUpdate = doc(database, "user", "BoRSwTnhUmhmZ04qcuWN");
    deleteDoc(docToUpdate)
      .then((res) => {
        alert("data deleted");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  // handle Files Uploads
  const handleUploadFiles = () => {
    //const storageRef = ref(storage, fileData.name); // files
    const storageRef = ref(storage, `images/${fileData.name}`); // Folder
    const uploadTask = uploadBytesResumable(storageRef, fileData);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        alert(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );

    console.log(fileData);
  };
  //handle fetch data in real time once added data it get in the same time and using useEffect under it
  const getDataInRealTime = () => {
    onSnapshot(collectionRef, (data) => {
      const newData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(newData);
    });
  };
  useEffect(() => {
    getDataInRealTime();
  }, []);

  //get Data using Filter age<20
  const getDataUsingAgeFilter = () => {
    onSnapshot(ageQuery, (data) => {
      const newData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(newData);
    });
  };
  useEffect(() => {
    getDataInRealTime();
  }, []);

  //handle LogOut
  const handleLogout = () => {
    signOut(auth);
  };

  // handle  changes occured between login & logout  when he login alert user is login
  //when he logout alert mean user logout
  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      if (data) {
        alert("Loged In");
      } else {
        alert("Not Logined In");
      }
    });
  }, []);

  return (
    <div className="App">
      <h1>Authentication</h1>
      <button onClick={createUserandPassword}>Create User And Password</button>
      <button onClick={signIn}>signIn</button>
      <button onClick={googleSign}>Google Sign</button>
      <button onClick={gitHubSign}>Github Sign</button>
      <h1>CRUD Operation</h1>
      <button onClick={addDataToDatabase}>Add Data To Database</button>
      <button onClick={getAllDataToDatabase}>Get All Data To Database</button>
      <button onClick={updateDataToDatabase}>Update Data</button>
      <button onClick={deleteDataToDatabase}>Delete Data</button>
      <h1>Storage Files & videos Without server side</h1>
      <input
        type={"file"}
        onChange={(e) => {
          setFileData(e.target.files[0]);
        }}
      />
      <button onClick={handleUploadFiles}>Upload File</button>
      <button onClick={getDataInRealTime}>Get Data In Real Time </button>
      <button onClick={getDataUsingAgeFilter}>
        Get Data Using Age Filter less Than 20{" "}
      </button>
      <h1>Login & Register</h1>
      <input
        type={"text"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type={"password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}>Login</button>
      <button onClick={handleLogout}>Logout</button>
     
      
    </div>
  );
}

export default App;
