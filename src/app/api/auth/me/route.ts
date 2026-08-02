import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { error } from "console";
import { prisma } from "@/lib/prisma";

export async function GET(){
    try{
        const currentUser = await getCurrentUser();

        if (!currentUser){
            return NextResponse.json(
                {error: 'Not authenticated'},
                { status: 401}
            );
        }

        const user = await prisma.user.findUnique({
            where:{ id: currentUser.userId},
            include:{
                adresses:{
                    where: { isDefault: true},
                    take: 1
                },
            },
        });

        if (!user){
            return NextResponse.json(
                {error:'User not found'},
                {status: 404}
            );
        }

        const {password, ...userWithoutPassword}= user;

        return NextResponse.json({
            user:userWithoutPassword
        });
    } catch (error){
        console.error('Get user error:',error);
        return NextResponse.json(
            {error:'Failed to get user'},
            {status: 500}
        );
    }
}