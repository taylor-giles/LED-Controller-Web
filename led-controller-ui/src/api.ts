import axios from 'axios';

const apiCaller = axios.create({
    baseURL: "https://lights.taylorgiles.me/api",
    timeout: 1000
});

export async function getNewId(): Promise<string>{
    return apiCaller.get('generate').then((res) => {
        return res.data._id;
    }).catch((error) => "ERROR")
}