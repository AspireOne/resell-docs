import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            if (!profile) throw new Error("No profile")

            if (profile.email === "matejpesl1@gmail.com" || profile.email === "") {
                return true;
            }
            return false;
        },
    }
})