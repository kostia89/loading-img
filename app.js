import { upload } from './upload'
import  firebase  from 'firebase/app'
import 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyB5aMKw_fPbzKogd1E6GVQzKCBps53bS9w",
    authDomain: "loading-img.firebaseapp.com",
    projectId: "loading-img",
    storageBucket: "loading-img.appspot.com",
    messagingSenderId: "278403930107",
    appId: "1:278403930107:web:2b843479067561c440dd5e"
};  
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage()

upload('file', {
    multi: true,
    accept:['.jpeg', '.png', '.jpg', '.svg', '.gif'],
    onLoad(files, blocks){
        files.forEach((file, index) => {
        const ref = storage.ref(`imeges/${file.name}`);
        const task = ref.put(file)

        task.on('state_changed', snapshot => {
            let percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
            let block = blocks[index].querySelector('.preview-info-progres')  
            block.textContent = percentage
            block.style.width = percentage 
            console.log(percentage);
        },error => {
            console.log(error);
        },() =>{
            task.snapshot.ref.getDownloadURL().then(url =>{
                console.log('Download URL', url);
            })
        })
        });
    }
});
