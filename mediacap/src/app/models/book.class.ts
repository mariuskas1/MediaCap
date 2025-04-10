export class Book {
    title!: string;
    rating!: number;
    author?: string;
    year?: number;
    yearRead!: number;
    monthRead!: string;
    favorite!: boolean;
    id?:string;
    timestamp!: number;
    genres!: string[]; 


    constructor(object?: any) {
        this.title = object ? object.title : '';
        this.rating = object ? object.rating : 2.5; 
        this.author = object ? object.author : '';
        this.year = object ? object.year : null; 
        this.yearRead = object ? object.yearWatched : null; 
        this.monthRead = object ? object.monthWatched : '';
        this.favorite = object ? object.favorite : false;
        this.id = object ? object.id : '';
        this.timestamp = object ? object.timestamp : null; 
        this.genres = object ? object.genres || [] : []; 
    }
}