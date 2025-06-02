import axios from 'axios';

const PET_API = 'http://192.168.50.13:4000/pets'
// const PET_API = 'http://172.20.10.9:4000/pets'

export async function fetchPets() {
    try {
        const response = await axios.get(PET_API)
        return response.data; 
    } catch (err) {
        console.error(err.message);
    }
    
}