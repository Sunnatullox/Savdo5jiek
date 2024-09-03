import { Prisma } from "@prisma/client";
import prisma from "../config/db";


export async function createContactUs(data: Prisma.ContactUsCreateInput) {
    return await prisma.contactUs.create({
        data
    })
}

export async function getContactUs(id: string) {
    return await prisma.contactUs.findUnique({
        where: {
            id
        }
    })
}

export async function getContactUsList(query: Prisma.ContactUsFindManyArgs) {
    return await prisma.contactUs.findMany(query)
}



export async function updateContactUs(id: string, data: Prisma.ContactUsUpdateInput) {
    return await prisma.contactUs.update({
        where: {
            id
        },
        data
    })
}

export async function deleteContactUs(id: string) {
    return await prisma.contactUs.delete({
        where: {
            id
        }
    })
}


