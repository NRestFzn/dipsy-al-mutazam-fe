import { Heart, Loader2 } from "lucide-react";

interface LoadingProps {
  type?: "spinner" | "heartbeat";
  text?: string;
  className?: string;
}

export default function Loading({ 
  type = "heartbeat",
  text = "Memuat data...",
  className = ""
}: LoadingProps) {

  if (type === "heartbeat") {
    return (
      <div className={`flex flex-col items-center justify-center w-full h-full min-h-[50vh] p-4 ${className}`}>
        <div className="relative flex items-center justify-center">
          <div className="absolute w-12 h-12 bg-[#00A651] rounded-full animate-ping opacity-20"></div>
          
          <Heart 
            className="w-12 h-12 text-[#00A651] fill-[#00A651] animate-pulse drop-shadow-sm" 
            strokeWidth={1.5}
          />
        </div>
        
        <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center w-full h-full min-h-[50vh] p-4 ${className}`}>
      <Loader2 
        className="w-10 h-10 text-[#00A651] animate-spin" 
        strokeWidth={2.5}
      />
      <p className="mt-3 text-sm font-medium text-gray-500">
        {text}
      </p>
    </div>
  );
}