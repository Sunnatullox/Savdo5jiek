import { Prisma } from "@prisma/client";
import prisma from "../config/db";


export async function createContactUs(data: Prisma.ContactUsCreateInput) {
    return await prisma.contactUs.create({
        data
    })
}

export async function getContactUs(id: string) {
    return await prisma.contract.findUnique({
        where: {
            id
        }
    })
}

export async function getContactUsList(query: Prisma.ContractFindManyArgs) {
    return await prisma.contract.findMany(query)
}



export async function updateContactUs(id: string, data: Prisma.ContractUpdateInput) {
    return await prisma.contract.update({
        where: {
            id
        },
        data
    })
}

export async function deleteContactUs(id: string) {
    return await prisma.contract.delete({
        where: {
            id
        }
    })
}


