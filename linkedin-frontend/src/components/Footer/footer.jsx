import React from 'react';

const Footer = () => {
  return (
    <div className="w-full bg-white border-t border-gray-200">
      <div className="mx-auto max-w-[1128px] px-4 md:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <span className="font-bold text-black">Linked</span>
          <img src="https://pngimg.com/d/linkedIn_PNG13.png" alt="LinkedIn Logo" className="w-4 h-4" />
          <span>© 2025</span>
        </div>
        <a href="#" className="hover:underline">User Agreement</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Community Guidelines</a>
        <a href="#" className="hover:underline">Cookie Policy</a>
        <a href="#" className="hover:underline">Copyright Policy</a>
        <a href="#" className="hover:underline">Send Feedback</a>
        <a href="#" className="hover:underline">Language</a>
      </div>
    </div>
  );
};

export default Footer;