export type Chord = {
    symbol: string,
    tonic: string,
    degrees: string[],
    notes: string[],
}

export enum TriadType {
    MAJOR = 'maj',
    MINOR = 'min',
    SUSPENDED_SECOND = 'sus2',
    SUSPENDED_FOURTH = 'sus4',
    AUGMENTED = 'aug',
    DIMINISHED = 'dim',
}
