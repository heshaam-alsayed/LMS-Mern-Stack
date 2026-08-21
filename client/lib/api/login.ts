import { loginFormData } from "@/types/auth.type";

export const login = async (body:loginFormData)=>{
    const serverURI = process.env.NEXT_PUBLIC_SERVER_URI 
    const res = await fetch(`${serverURI}/auth/login-user`, {
        method:"POST",
        headers: {
            "Content-Type":"application/json",
        },
        credentials: "include",
        body : JSON.stringify(body)
    })
    const result = await res.json() 
    if(!res.ok){
        throw new Error(result.message)
    }
    return result
}