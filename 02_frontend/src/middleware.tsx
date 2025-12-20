import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // 1. Prüfen, ob wir im Entwicklungs-Modus sind (da nervt das Passwort nur)
    if (process.env.NODE_ENV === "development") {
        return NextResponse.next();
    }

    // 2. Das Passwort aus den Vercel-Einstellungen holen
    const validUser = process.env.BASIC_AUTH_USER;
    const validPass = process.env.BASIC_AUTH_PASSWORD;

    // Wenn keine Variablen gesetzt sind, lassen wir (aus Sicherheitsgründen) niemanden rein oder alles offen?
    // Besser: Alles offen lassen, falls man es vergessen hat, oder Warnung.
    // Hier: Wenn nicht konfiguriert, einfach durchlassen.
    if (!validUser || !validPass) {
        return NextResponse.next();
    }

    // 3. Den Browser nach dem "Authorization" Header fragen
    const basicAuth = req.headers.get("authorization");

    if (basicAuth) {
        const authValue = basicAuth.split(" ")[1];
        const [user, pwd] = atob(authValue).split(":");

        if (user === validUser && pwd === validPass) {
            return NextResponse.next();
        }
    }

    // 4. Wenn falsch oder gar nicht eingeloggt -> Anmeldefenster zeigen
    return new NextResponse("Auth Required.", {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Secure Area"',
        },
    });
}

// Hier legen wir fest, welche Seiten geschützt werden sollen
// Wir schützen alles, AUSSER Bilder, Icons und API-Routen (damit die App hübsch bleibt)
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - manifest.json (PWA manifest)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)",
    ],
};