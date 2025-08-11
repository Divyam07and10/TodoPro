import { CookieOptions } from "express";

export const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 1 * 24 * 60 * 60 * 1000, //  1 day
};