import axios from "axios";

export class MainService
{
    static async getToyTypes()
    {
        return await  axios.get<string[]>(`./toyTypes.json`) 
    }
}