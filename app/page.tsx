import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-background text-center px-4 py-12 gap-10">
      <Image src="/images/manage.png" alt="Employee Management" width={600} height={400} className="mb-6" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 -z-10 " />
      <div className="pl-20 max-w-3xl w-full space-y-8">
        {/* Logo / Icon */}
        <div className="flex justify-center">
          <div className="bg-blue-600/10 p-5 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zM6 20h12M12 12v8"
              />
            </svg>
          </div>
        </div>
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
          Empower Your Workforce
        </h1>
        {/* Subtext */}
        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
          The all-in-one Employee Management System that streamlines onboarding, payroll, attendance, and performance—all from one dashboard.
        </p>
        {/* Call-to-Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-blue-600 px-8 py-4 text-white font-semibold text-lg shadow hover:bg-blue-700 transition duration-200"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="inline-block rounded-lg border border-blue-600 px-8 py-4 text-blue-600 font-semibold text-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
