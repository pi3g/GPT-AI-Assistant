export function roleToIcon(role: string) {
    switch(role) {
        case "user": return "mdi-account";
        case "assistant": return "mdi-brain";
    }
}
export function roleToClass(role: string) {
    switch(role) {
        case "user": return "text-subtitle-2 text-right";
        case "assistant": return "text-subtitle-2";
    }
}
export function roleToName(role: string) {
    switch(role) {
        case "user": return "You";
        case "assistant": return "GPT";
    }
}