import { app } from "./app";

app("PW769258045BR")
    .then(() => {
        console.log('Done');
    })
    .catch((err: Error) => {
        console.log('Error: ' + err.message);
    })