export function stringForError(value: unknown): string {
    try {
        return String(value);
    } catch {
        return '<could not convert to string>';
    }
}
