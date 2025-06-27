const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-700 mt-20">
      <div className="flex flex-col md:flex-row w-full justify-between items-start gap-10">
        {/* Branding */}
        <div className="w-[500px] space-y-4 pl-10">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-500"
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
            <h2 className="text-2xl font-bold text-white whitespace-normal">
              Employee Management System
            </h2>
          </div>
          <p className="text-gray-400 text-sm">
            Simplifying HR tasks with automation and smart management.
          </p>

        </div>

        {/* Services */}
        <div className="w-[200px]">
          <h3 className="text-white text-lg font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-blue-400">Employee Onboarding</a></li>
            <li><a href="#" className="hover:text-blue-400">Payroll Management</a></li>
            <li><a href="#" className="hover:text-blue-400">Attendance Tracking</a></li>
            <li><a href="#" className="hover:text-blue-400">Performance Reviews</a></li>
          </ul>
        </div>

        {/* Company */}
        <div className="w-[200px]">
          <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-blue-400">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400">Careers</a></li>
            <li><a href="#" className="hover:text-blue-400">Blog</a></li>
            <li><a href="#" className="hover:text-blue-400">Contact</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="w-[200px]">
          <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
            <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-400">Cookie Policy</a></li>
            <li><a href="#" className="hover:text-blue-400">Security</a></li>
          </ul>
        </div>

      </div>
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Md. Abdullah Shishir. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
