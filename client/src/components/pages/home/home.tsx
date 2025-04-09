import React from 'react';

const menuItems = [
    { name: 'PLAY', link: '/play' },
    { name: 'OPTIONS', link: '/options' },
    { name: 'QUIT', link: '/quit' },
]

export default function Home() {
    return (
        <div className="text-black relative bg-[#050505] w-[100%] h-[100%] bg-cover overflow-hidden bg-[url('/images/menuBg.jpg')]">
            <nav className="flex justify-center items-center w-auto h-[100%] mt-7">
                <ul className="flex flex-col justify-center items-center gap-15">
                    {menuItems.map((item, index) => (
                        <li key={index} className="text-7xl font-bold text-[#FDF1C7] font-byte">
                            {item.name}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}