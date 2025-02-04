'use client';

import { useState, useEffect, useRef, MouseEvent, RefObject } from 'react';
import Link from 'next/link';
import { FaChess } from 'react-icons/fa';
import { LuAlignJustify } from 'react-icons/lu';
import './styles.css';

const Navbar = () => {
  const Links = [{ name: 'ChessGame', link: '/' }];
  let User = [
    { name: 'Login', link: '/login' },
    { name: 'Profile', link: '/profile' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: any): void => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  const handleClickOutside = (event: any): void => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  const handleResize = (): void => {
    if (window.innerWidth >= 1024) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={`flex items-center fixed z-30 top-0 w-full min-w-[360px] py-2 px-8 text-sm font-medium bg-white shadow-md ${isMenuOpen}`}
    >
      <div className="lg:hidden justify-between flex items-center w-full lg:w-auto">
        <div className="flex items-center">
          <FaChess
            size={40}
            className="bg-blue-200 p-1 border-2 border-black rounded shadow-lg"
          />
          <Link href="/" className="font-semibold text-lg ml-2 select-none">
            LJDR-Chess
          </Link>
        </div>

        <div className="flex gap-3 items-center">
          <button className="lg:hidden text-xl" onClick={toggleMenu}>
            <LuAlignJustify />
          </button>
        </div>
      </div>
      <div
        ref={menuRef}
        className={`flex lg:flex lg:justify-between lg:items-center gap-10 fixed lg:static bg-white lg:bg-transparent w-full shadow-md lg:shadow-none ${
          isMenuOpen ? 'menu-open left-0 pl-8' : 'hidden'
        }`}
      >
        <ul className="flex flex-col lg:flex-row lg:gap-8 lg:items-center">
          <li className="hidden lg:flex items-center w-full lg:w-auto">
            <div className="flex items-center">
              <FaChess
                size={40}
                className="bg-blue-200 p-1 border-2 border-black rounded shadow-lg"
              />
              <Link href="/" className="font-semibold text-lg ml-2 select-none">
                LJDR-Chess
              </Link>
            </div>
            <button className="lg:hidden text-xl" onClick={toggleMenu}>
              <LuAlignJustify />
            </button>
          </li>
          {Links.map((link) => (
            <li className="lg:m-0 mt-5 mb-5 ml-2" key={link.name}>
              <Link href={link.link} onClick={closeMenu}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col lg:flex-row lg:gap-8 lg:items-center">
          {User.map((link) => (
            <li className="lg:m-0 mt-5 mb-5 ml-2" key={link.name}>
              <Link href={link.link} onClick={closeMenu}>
                {link.name}
              </Link>
            </li>
          ))}
          <li className="lg:m-0 mt-5 mb-5 ml-2">
            <Link href="/sign-in"></Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
