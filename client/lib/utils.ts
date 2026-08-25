import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const timeAgo = (date: string) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
};

export const convertToBase64 = async (file: File): Promise<string> => {
  try {
    const result = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      console.log(reader);

      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };

      reader.onerror = (error) => {
        reject(new Error("Failed to convert image to Base64"));
      };

      reader.readAsDataURL(file);
    });


    return result;
  } catch (error) {
    throw new Error("Failed to process image");
  }
};