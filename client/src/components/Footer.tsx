import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-6 bg-white border-t border-slate-100 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Muscle Anatomy Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;