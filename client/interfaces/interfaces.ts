export interface Pet {
    _id: string;
    name: string;
    category: string;
    location: string;
    character: string;
    description: string;
    gender: string;
    microchip: string;
    breed: string;
    age: number;
    photos: string[];
    sourceId: string;
    sourceName: string;
    note: string;
}

export interface Centre {
    name: string;
    contact: string;
    address: string;
}

export interface Shelter {
    id: string;
    name: string;
    location: string;
    contact: Centre[] ;
    website: string;
    logo: any;
    about:string;
    donate:string;
}