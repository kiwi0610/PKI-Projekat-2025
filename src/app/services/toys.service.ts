import axios from "axios";

const client = axios.create({
    baseURL: 'https://toy.pequla.com/api',
    validateStatus: (status: number) => status === 200,
    headers: {
        'Accept': 'application/json',
        'X-Name': 'PKI/2025'
    }
});

export class ToysService {

    static async getToys() {
        return await client.get('/toy');        // Ovde se vraća cela lista igračaka koje je pokupio sa API-ja
    }

    static async getToysById(id: number) {
        return await client.get(`/toy/${id}`); 
    }

}
