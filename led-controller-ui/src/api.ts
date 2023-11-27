import axios from 'axios';
import type { IDevice, IDisplay, IGradient } from '../../led-controller-server/schemas';

const apiCaller = axios.create({
    baseURL: "https://lights.taylorgiles.me/api",
    timeout: 1000
});

//GETTERS

//Returns the new ID
export async function getNewId(numPixels: number): Promise<string>{
    return apiCaller.post('generate', {numPixels: numPixels}).then((res) => {
        return res.data._id;
    }).catch((error) => "ERROR")
}

//Returns the IDevice object, or null on error
export async function getConfig(id: string): Promise<IDevice | null>{
    return apiCaller.get(`config/${id}`).then((res) => {
        return res.data;
    }).catch((error) => null)
}

//Returns the ID of the guest device
export async function getGuestId(): Promise<string> {
    return apiCaller.get(`getGuest`).then((res) => {
        return res.data._id
    }).catch((error) => "ERROR")
}

//SETTERS - Return error on failure, null on success
export async function setColors(id: string, colors: string[]): Promise<any | null>{
    return apiCaller.post(`setColors/${id}`, colors).then((res) => {
        return null;
    }).catch((error) => error);
}
export async function setGradients(id: string, gradients: IGradient[]): Promise<any | null>{
    return apiCaller.post(`setGradients/${id}`, gradients).then((res) => {
        return null;
    }).catch((error) => error);
}
export async function setDisplay(id: string, display: IDisplay): Promise<any | null>{
    return apiCaller.post(`setDisplay/${id}`, display).then((res) => {
        return null;
    }).catch((error) => error)
}
