export class Series {
    title!: string;
    rating!: number;
    year?: number;
    yearWatched!: number;
    monthWatched!: string;
    favorite!: boolean;
    id?: string;
    timestamp!: number;
    genres!: string[]; 

    constructor(object?: any) {
        this.title = object ? object.title : '';
        this.rating = object ? object.rating : 2.5; 
        this.year = object ? object.year : null; 
        this.yearWatched = object ? object.yearWatched : null; 
        this.monthWatched = object ? object.monthWatched : '';
        this.favorite = object ? object.favorite : false;
        this.id = object ? object.id : '';
        this.timestamp = object ? object.timestamp : null; 
        this.genres = object ? object.genres || [] : []; 
    }
}