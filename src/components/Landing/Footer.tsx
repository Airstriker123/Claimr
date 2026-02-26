import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Footer(): JSX.Element {
    const footerRef = useRef<HTMLDivElement>(null);
    const columnsRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (columnsRef.current.length) {
                columnsRef.current.forEach((col, i) => {
                    gsap.from(col, {
                        scrollTrigger: {
                            trigger: col,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse',
                        },
                        opacity: 0,
                        y: 50,
                        duration: 1,
                        ease: 'power3.out',
                        delay: i * 0.2, // stagger between columns
                    });
                });
            }
        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer
            ref={footerRef}
            className="overflow-hidden flex flex-col items-start gap-12 px-6 md:px-16 py-16 w-full"
        >
            <div className="flex flex-col md:flex-row gap-12 w-full">
                {[
                    {
                        title: 'Social',
                        links: [
                            { label: 'GitHub', href: 'https://github.com/airstriker123' },
                            { label: 'Discord', href: 'https://discord.gg/yourserver' },
                            { label: 'Email', href: 'mailto:youremail@example.com' },
                        ],
                    },
                    {
                        title: 'Support',
                        links: [
                            { label: 'Report an Issue', href: 'https://github.com/airstriker123/Claimr/issues' },
                            { label: 'Documentation', href: '/docs' },
                            { label: 'FAQ', href: '/faq' },
                        ],
                    },
                    {
                        title: 'Claimr',
                        links: [
                            { label: 'Open Source', href: 'https://github.com/airstriker123/Claimr' },
                            { label: 'Privacy', href: '/privacy' },
                            { label: 'Terms', href: '/terms' },
                        ],
                    },
                ].map((col, idx) => (
                    <div
                        key={idx}
                        ref={(el) => {
                            if (el) columnsRef.current[idx] = el;
                        }}
                        className="flex flex-col gap-4 pt-6 border-t border-white w-full"
                    >
                        <h3 className="font-bold text-white text-2xl transition-colors duration-300">
                            {col.title}
                        </h3>

                        <ul className="flex flex-col gap-2">
                            {col.links.map((link, i) => (
                                <li key={i}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white text-base hover:underline"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </footer>

    );
}
