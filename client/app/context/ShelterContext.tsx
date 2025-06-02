import { Shelter } from "@/interfaces/interfaces";
import { PropsWithChildren, createContext, useContext, useState } from 'react';
import SPCA_LOGO from '../../assets/SPCA_logo.png'
import HKDR_LOGO from '../../assets/HKDR_logo.png'

type ShelterContextType = {
    shelterData : Shelter[];
}

const ShelterContext = createContext<ShelterContextType>({
    shelterData: [],
})

const SPACE_CENTRES = [
    {
        name:"Hong Kong Centre - Headquarters",
        contact:"2802 0501",
        address:"5 Wan Shing Street, Wan Chai, Hong Kong",
    },
    {
        name:"SPCA Jockey Club Centennial Centre (Tsing Yi Centre)",
        contact:"2232 5555",
        address:"38 Cheung Fai Road, Tsing Yi", 
    },
    {
        name:"Kowloon Centre",
        contact:"2713 9104",
        address:"105 Princess Margaret Road, Kowloon"
    },
    {
        name:"Cheung Chau Clinic",
        contact:"2981 9104",
        address:"Cheung Chau Clinic, Tung Wan, Cheung Chau"
    },
    {
        name:"Sai Kung Centre",
        contact:"2792 1535",
        address:"7 Shau Tsui Path, Sai Kung"
    },
    {
        name:"Sai Kung Adopt-A-Pet Centre",
        contact:"2232 5599",
        address:"65 Man Nin Street, Sai Kung"
    },
    {
        name:"Hang Hau Clinic",
        contact:"2243 0080",
        address:"Flat B, 2/F, Block 5, Hang Hau Village, Tseung Kwan O"
    },
    {
        name:"Fairview Animal Welfare Centre",
        contact:"2482 2770",
        address:"Junction of Fairview Park Boulevard and Kam Pok Road, Yuen Long"
    },
    {
        name:" Mui Wo Clinic",
        contact:"2984 0060",
        address:"Shop 14, Mui Wo Clinic, 3 Ngan Wan Road, Mui Wo, Lantau"
    }
]

const HKDR_CENTRES =[
    {
        name:"Ap Lei Chau Homing Centre",
        contact:"info@hongkongdogrescue.com",
        address:"G/F, 13-15 Wai Fung Street, Ap Lei Chau, Hong Kong",
    },
    {
        name:"Tai Po Homing Centre",
        contact:"info@hongkongdogrescue.com",
        address:"6 Shek Lin Road, Tai Po, Hong Kong"
    }
]

const SPCA_INFO = {
  id: "1",
  name: "SPCA",
  location: "Hong Kong",
  contact: SPACE_CENTRES,
  website:"https://www.spca.org.hk/",
  logo: SPCA_LOGO,
  about:`The Hong Kong Society for the Prevention of Cruelty to Animals (SPCA) – as we were known in the early days – was formed by a group of volunteers in 1903 who wanted to prevent cruel treatment to livestock during transportation and slaughter. It was the first charity in Hong Kong to take on the challenge of dealing with all aspects of animal welfare.
  
The work of the organisation was recognised by the UK’s Royal Society for the Prevention of Cruelty of Animals and changed its name to RSPCA HK in 1978, and changed again in 1997 to reflect the return of Hong Kong to mainland China.

The founding principles of those early pioneers remains the same today: a belief that animals feel pain, hunger and thirst – just like humans – and we should not inflict suffering on them simply because they can’t defend themselves.`,
  donate:"https://www.spca.org.hk/get-involved/how-to-donate/",

}



const HKDR_INFO = {
  id: "2",
  name: "HKDR",
  location: "Hong Kong",
  contact: HKDR_CENTRES,
  website:"https://hongkongdogrescue.com/",
  logo: HKDR_LOGO,
  about:`HKDR was founded in 2003 for the specific purpose of saving dogs and puppies from the Hong Kong Government’s Agriculture, Fisheries and Conservation Department (AFCD) Animal Management Centres, where at that time thousands of dogs and puppies were destroyed every year. These days most of the dogs and puppies taken in by HKDR come from a variety of other sources.

Some of these dogs are ex-breeder dogs, those that are no longer useful for the purpose of producing puppies for the pet trade. They are inevitably in poor health and condition due to their previous hard lives, and they need extensive veterinary treatment, including surgery.

Of the dogs and puppies lucky enough to be rescued by HKDR, the larger ones will be taken care of at our main Tai Po Homing Centre, while smaller dogs and puppies awaiting re-homing stay at the Kennedy Town Homing Centre.

As much as possible, very young puppies  are placed in temporary foster care where they can live in a home environment before being permanently adopted. Our foster network also plays a vital role in helping dogs who come to us in poor health or needing surgery.

swAlongside the rescue and re-homing efforts, education is also an important part of HKDR’s mission, with workshops and online seminars on a variety of subjects being regularly hosted.   HKDR also runs monthly ‘Positive Partners’ Training Courses, which are designed to promote responsible pet ownership as well as reward-based training methods.`,
  donate:"https://hongkongdogrescue.com/donate/one-off-donations/"
}

export const ShelterProvider = ({ children }: PropsWithChildren<{}>) => {
    // const [ shelterData, setShelterData ] = useState<Shelter[]>([]);
    const shelterData = [ SPCA_INFO, HKDR_INFO ]

    return (
        <ShelterContext.Provider value={{
            shelterData
        }}>
            {children}
        </ ShelterContext.Provider>
    )

} 

export const useShelterContext = () => useContext(ShelterContext);

export default ShelterProvider;