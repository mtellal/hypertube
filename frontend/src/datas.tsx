import user1 from './assets/userPhotos/pexels-bia-valim-2850989.jpg'
import user2 from './assets/userPhotos/pexels-marlon-morais-1773450.jpg'
import user3 from './assets/userPhotos/pexels-cottonbro-studio-5264743.jpg'
import user4 from './assets/userPhotos/pexels-min-an-1066132.jpg'
import user5 from './assets/userPhotos/pexels-vinicius-wiesehofer-1130626.jpg'
import user6 from './assets/userPhotos/cartLogin1.jpg'


export const currentUser = {
    id: 2,
    photos: [user5, user1, user2, user3],
    name: "Margot Duran",
    age: '26',
    localisation: 'Paris, France',
    likes: '24',
    views: '79',
    fameRating: '4.2',
    reviews: '13',
    status: 'offline',
    lastConnection: '21/7/2023 10:11:45',
    gender: 'female',
    sexualPreferences: 'male',
    tags: ["cute", "fitness", "healthy", "pretty"],
    biography: `A 26-year-old adventurous woman with a curious soul.
    \n\nPassionate about life and always seeking new experiences. You'll often find me exploring the streets, discovering new cafes, restaurants, and art exhibitions.`
}


type TUser = {
    id: number, 
    firstName: string, 
    lastName: string, 
    profilePicture: string, 
    age: number, 
    location: string, 
    fameRating: number,
    reviews: number, 

    photos?: string[],
    likes?: number, 
    views?: number, 
    status?: string, 
    lastConnection?: string, 
    gender?: string, 
    sexualPreferences?: string, 
    tags?: string[],
    biography?: string
}



export const users = [
    {
        id: 0,
        name: "Margot",
        age: "26",
        url: user1,
        localisation: "Paris, France", 
        fameRating: '4.4', 
        votes: '13'
    },
    {
        id: 1,
        name: "Scarlett",
        age: "27",
        url: user2,
        localisation: "Berlin, Germany", 
        fameRating: '3.9', 
        votes: '6'
    },
    {
        id: 2,
        name: "Tanisha",
        age: "24",
        url: user3,
        localisation: "Zurich, Switzerland", 
        fameRating: '4.2', 
        votes: '11'
    },
    {
        id: 3,
        name: "Zaynah",
        age: "22",
        url: user4,
        localisation: "Madrid, Spain", 
        fameRating: '3.2', 
        votes: '17'
    },
    {
        id: 4,
        name: "Lea",
        age: "27",
        url: user5,
        localisation: "Bordeaux, France", 
        fameRating: '4.1', 
        votes: '21'
    },
    {
        id: 5,
        name: "Patricia",
        age: "29",
        url: user6,
        localisation: "Rome, Italy", 
        fameRating: '2.7', 
        votes: '3'
    },
    {
        id: 6,
        name: "Margot",
        age: "26",
        url: user1,
        localisation: "Paris, France"
    },
    {
        id: 7,
        name: "Scarlett",
        age: "27",
        url: user2,
        localisation: "Berlin, Germany"
    },
    {
        id: 8,
        name: "Tanisha",
        age: "24",
        url: user3,
        localisation: "Zurich, Switzerland"
    },
    {
        id: 9,
        name: "Zaynah",
        age: "22",
        url: user4,
        localisation: "Madrid, Spain"
    },
    {
        id: 10,
        name: "Lea",
        age: "27",
        url: user5,
        localisation: "Bordeaux, France"
    },
    {
        id: 11,
        name: "Patricia",
        age: "29",
        url: user6,
        localisation: "Rome, Italy"
    },
    {
        id: 12,
        name: "Margot",
        age: "26",
        url: user1,
        localisation: "Paris, France"
    },
    {
        id: 13,
        name: "Scarlett",
        age: "27",
        url: user2,
        localisation: "Berlin, Germany"
    },
    {
        id: 14,
        name: "Tanisha",
        age: "24",
        url: user3,
        localisation: "Zurich, Switzerland"
    },
    {
        id: 15,
        name: "Zaynah",
        age: "22",
        url: user4,
        localisation: "Madrid, Spain"
    },
    {
        id: 16,
        name: "Lea",
        age: "27",
        url: user5,
        localisation: "Bordeaux, France"
    },
    {
        id: 17,
        name: "Patricia",
        age: "29",
        url: user6,
        localisation: "Rome, Italy"
    }
]


export const messages = [
    {
        id: 0, 
        message: "wfopuwhvwpuihfvwfwpuwhdvfw", 
        authorId: 2
    }, 
    {
        id: 1, 
        message: "wfopuwhvwpuihfvwfwpuwhdvfwwdiofuw[ifwbdwifbw", 
        authorId: 2
    }, 
    {
        id: 2, 
        message: "wfopuwhvwpu", 
        authorId: 2
    },
    {
        id: 3, 
        message: "wfopihfvwfwpuwhdvfw", 
        authorId: 3
    }, 
    {
        id: 4, 
        message: "wfopuwhvwpuihfvwfwdfw[ohuwd[ofwhfwwpuwhdvfw", 
        authorId: 3
    }
]


export const tags = ["travel", "photography", "food", "sports", "books", "art", "movies", "fashion", "technology", 
"nature", "animals", "fitness", "science", "video games", "social", "cuisine", "do it yourself", "astrology", "spirituality", 
"adventurous", "intellectual", "music", "career", "romantic" ]