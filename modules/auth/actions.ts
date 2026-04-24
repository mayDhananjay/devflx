"use server";

import {auth} from "@/auth";

import { db } from "@/lib/db";

const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

export const getUserById = async (id:string)=>{
    if (!isValidObjectId(id)) {
        return null;
    }

    try {
        const user = await db.user.findUnique({
            where:{id},
            include:{
                accounts:true
            }
        })
        return user
    } catch (error) {
         console.log(error)
        return null
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: { email },
            include: {
                accounts: true,
            },
        });

        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getAccountByUserId = async(userId:string)=>{
    try {
        const account = await db.account.findFirst({
            where:{
                userId
            }
        })

        return account
        
    } catch (error) {
         console.log(error)
        return null
    }
}

export const currentUser  = async()=>{
    const session = await auth();
    const user = session?.user;

    if (!user) {
        return null;
    }

    if (user.id && isValidObjectId(user.id)) {
        return user;
    }

    if (user.email) {
        const dbUser = await getUserByEmail(user.email);

        if (dbUser?.id && isValidObjectId(dbUser.id)) {
            return {
                ...user,
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                image: dbUser.image,
                role: dbUser.role,
            };
        }
    }

    return null;
}