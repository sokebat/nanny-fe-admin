import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Auth",
  description: "Auth",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="relative">
        <div className="hidden lg:block lg:w-[60%] lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:z-0 relative">
          <Image
            src="/images/authimage.jpg"
            alt="Mother and child"
            className="w-full h-full object-cover"
            width={1000}
            height={1000}
            priority
          />

          <div className="absolute inset-0 bg-linear-to-br from-transparent via-brand-navy/50 to-brand-navy/80" />
        </div>

        <div className="w-full lg:w-[40%] lg:ml-[60%]   flex flex-col justify-center  ">
          <div className="w-full pt-4 px-4 mx-auto">{children}</div>
        </div>
      </div>
    </main>
  );
}
