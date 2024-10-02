import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from "@utils/database";
import User from "@models/user";


console.log({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
})

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        session: async ({ session }) => {
            const sessionUser = await User.findOne({ email: session.user.email }, '_id')
            session.user.id = sessionUser._id.toString();
    
            return session;
        },
        signIn: async ({profile}) => {
            try {
                await connectToDB();
    
                // check if user already exists
                const userExists = await User.findOne({
                    email: profile.email
                });
                
    
                // if not, create a user. 
                if(!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(),
                        image:  profile.picture
                    })
                }
    
                return true;
    
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    }
})

export {handler as GET, handler as POST};