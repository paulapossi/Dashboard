
export const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Discipline is freedom.", author: "Jocko Willink" },
    { text: "The obstacle is the way.", author: "Marcus Aurelius" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Focus on the process, not the outcome.", author: "Anonymous" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins" },
    { text: "If you want to change the world, start off by making your bed.", author: "William H. McRaven" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" }
];

export function getDailyQuote() {
    const today = new Date();
    // Nutze Tag des Jahres + Jahr als Index-Seed, damit es jeden Tag rotiert, aber am selben Tag gleich bleibt
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = (today.getTime() - start.getTime()) + ((start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const index = dayOfYear % quotes.length;
    return quotes[index];
}
