import type { JSX } from 'react';
import Link from 'next/link';

const utilityLinks: { label: string; href: string }[] = [
  { label: 'Patients & Visitors', href: '/About-Us' },
  { label: 'Research & Clinical Trials', href: '#' },
  { label: 'For Clinicians', href: '#' },
  { label: 'Health & Science News', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Give', href: '#' },
  { label: 'MyChart', href: '#' },
];

const primaryLinks: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Find a Doctor', href: '/Doctors' },
  { label: 'Find a Location', href: '/About-Us' },
  { label: 'Conditions & Services', href: '/Services' },
];

/**
 * Static header shell shown in local dev when `headless-header` has no renderings from Sitecore.
 */
export function UChicagoLocalChrome(): JSX.Element {
  return (
    <div className="ucm-local-chrome text-neutral-900">
      <div className="bg-amber-100 px-4 py-1.5 text-center text-xs font-medium text-amber-950 ring-1 ring-amber-300">
        Local dev: Sitecore returned no{' '}
        <code className="rounded bg-amber-200/80 px-1">headless-header</code> components. Using
        static chrome. Set Edge env vars and publish content, or ignore this bar if intentional.
      </div>
      <div className="bg-[#3d3d3d] text-[0.8125rem] text-white">
        <div className="container flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-1 flex max-w-full flex-wrap items-center gap-x-0 gap-y-1 overflow-x-auto px-1 sm:flex-nowrap sm:overflow-visible">
            {utilityLinks.map((item, i) => (
              <span key={item.label} className="inline-flex items-center">
                {i > 0 ? <span className="mx-2 text-neutral-500" aria-hidden="true" /> : null}
                <Link
                  href={item.href}
                  className="whitespace-nowrap hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </div>
          <Link href="#" className="shrink-0 font-medium text-white hover:underline">
            Comer Children&apos;s Hospital
          </Link>
        </div>
      </div>
      <div className="border-b border-neutral-200 bg-white shadow-sm">
        <div className="container flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-[#6d1325]">
            UChicago Medicine
          </Link>
          <nav aria-label="Primary">
            <ul className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {primaryLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded px-1 py-1 text-[0.9375rem] font-medium text-neutral-800 hover:text-[#6d1325] sm:inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
