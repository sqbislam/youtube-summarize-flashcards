import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isValidYoutubeLink(link:string){
    const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var matches = link.match(p);
    if(matches && matches.length > 0){
        return true
    }
    return false;
}

export function formatTime(seconds:number) {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
        return 'Invalid input';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}





export const getYoutubeThumbnail = (url:string ) => {
    if (url === null) {
        return '';
    }
    const results = url.match('[\\?&]v=([^&#]*)');
    const video = (results === null) ? url : results[1];

    return 'http://img.youtube.com/vi/' + video + '/0.jpg';
};


