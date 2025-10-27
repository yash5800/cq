'use client'
import { usePathname } from "next/navigation"


export const routeTo = (destination: string) => {
  const path = usePathname();
  const end = path.split("/");
  if( end[end.length - 1] == "admin"){
    return "/admin" + destination;
  }
  else{
    end.pop();
    return end.join("/") + destination;
  }
}