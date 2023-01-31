import {Collection} from "mongodb";
import {Context} from "./context";

export async function isPinValid(pin: number, ctx: Context): Promise<boolean> {
    return await ctx.pins.findOne({pin: pin}) !== null;
}

export async function isCodeValid(code: number, ctx: Context): Promise<boolean> {
    return await ctx.codes.findOne({code: code}) !== null;
}

export async function createCode(ctx: Context): Promise<number> {
    const allCodes = await ctx.codes.find({}).toArray();
    
    let code: number;
    do {
        code = Math.floor(1000 + Math.random() * 9000);
    } while (allCodes.find(c => c.code === code));

    await ctx.codes.insertOne({code: code, createdAt: new Date()});
    return code;
}

export async function removeCode(code: number, ctx: Context): Promise<void> {
    await ctx.codes.deleteOne({code: code});
}