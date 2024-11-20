export class Film {
    title!: string;
    rating!: number;
    director?: string;
    year?: number;
    yearWatched!: number;
    monthWatched!: string;
    favorite!: boolean;
    id?: string;
    theatre!: boolean;
    timestamp!: number;
    genres!: string[]; 

    constructor(object?: any) {
        this.title = object ? object.title : '';
        this.rating = object ? object.rating : 2.5; 
        this.director = object ? object.director : '';
        this.year = object ? object.year : null; 
        this.yearWatched = object ? object.yearWatched : null; 
        this.monthWatched = object ? object.monthWatched : '';
        this.favorite = object ? object.favorite : false;
        this.id = object ? object.id : '';
        this.theatre = object ? object.theatre : false;
        this.timestamp = object ? object.timestamp : null; 
        this.genres = object ? object.genres || [] : []; 
    }
}