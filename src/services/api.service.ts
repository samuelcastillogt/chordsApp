import axios from "axios"
export const API_URL = "http://127.0.0.1:5000";

export type SongChord = {
    name: string;
    position: number;
}

export type SongLine = {
    lyrics: string;
    chords: SongChord[];
}

export type SongPayload = {
    slug: string;
    title: string;
    artist: string;
    album: string;
    tonality: string;
    bpm: number;
    lines: SongLine[];
    availableChords: string[];
}

export class ApiService {
    async checkApi(): Promise<boolean> {
        const response = await axios.get(`${API_URL}/api/v1/health`)
        return response.status === 200
    }

    async getModes(): Promise<any> {
        const response = await axios.get(`${API_URL}/api/v1/modes`)
        return response.data
    }

    async getNotes(): Promise<any> {
        const response = await axios.get(`${API_URL}/api/v1/notes`)
        return response.data
    }

    async getScales(note: string, mode: string): Promise<any> {
        const response = await axios.get(`${API_URL}/api/v1/scales/${encodeURIComponent(note)}/${encodeURIComponent(mode)}`)
        return response.data
    }

    async getSong(songName: string): Promise<SongPayload> {
        const response = await axios.get(`${API_URL}/api/v1/song/${encodeURIComponent(songName)}`);
        return response.data;
    }

    async getChordSvg(chordName: string): Promise<string> {
        const response = await axios.get(`${API_URL}/api/v1/chords/guitar/${encodeURIComponent(chordName)}.svg`, {
            responseType: "text",
            headers: {
                Accept: "image/svg+xml",
            },
        });
        return response.data;
    }
}
