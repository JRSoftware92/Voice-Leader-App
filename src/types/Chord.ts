export type Chord = {
    symbol: string,
    tonic: string,
    degrees: string[],
    notes: string[],
}
export enum ChordType {
    MAJOR = 'maj',
    MINOR = 'min',
    MAJOR_MINOR = 'm/M',
    SUSPENDED_SECOND = 'sus2',
    SUSPENDED_FOURTH = 'sus4',
    AUGMENTED = 'aug',
    DIMINISHED = 'dim',
    DOMINANT = 'dom',
}
