
export function validateEmail(email: string) {
    return (email && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
}

export function validateNames(name: string) {
    return (name && name.match(/^[a-zA-Z]+$/))
}
