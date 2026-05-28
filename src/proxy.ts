import { NextRequest, NextResponse } from "next/server";

const authPages = ['/login', '/otp'];

export function proxy(req: NextRequest) {
    const refreshToken = req.cookies.get('refreshToken');

    const isAuthPage = authPages.includes(req.nextUrl.pathname);

    if (refreshToken && isAuthPage) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/otp']
}