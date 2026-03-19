import Link from 'next/link';
import React from 'react';

const quickLinks = [
  {
    title: 'Matter Intake',
    description: 'Open a new matter request and submit required details.',
    href: '/portal?view=matter-intake',
  },
  {
    title: 'Time Entry',
    description: 'Capture billable and non-billable work for this week.',
    href: '/portal?view=time-entry',
  },
  {
    title: 'Expense Upload',
    description: 'Submit receipts and travel expenses for approval.',
    href: '/portal?view=expense-upload',
  },
  {
    title: 'Knowledge Base',
    description: 'Search playbooks, templates, and firm policies.',
    href: '/portal?view=knowledge-base',
  },
];

const announcements = [
  {
    title: 'Quarterly compliance training due Friday',
    detail: 'Please complete the annual security and privacy modules by 5 PM.',
  },
  {
    title: 'Client portal upgrade this weekend',
    detail: 'Saturday 10 PM - Sunday 2 AM CT. Brief read-only window expected.',
  },
  {
    title: 'Updated conflict-check workflow',
    detail: 'New request fields are now required for all net-new engagements.',
  },
];

const myTasks = [
  'Review NDA redlines for Project Northstar',
  'Approve outside counsel invoice batch',
  'Prepare Q2 board meeting legal summary',
  'Finalize updated vendor DPA template',
];

const myApprovals = [
  {
    request: 'Outside Counsel Guideline Exception',
    owner: 'J. Rivera',
    due: 'Today',
    href: '/portal?view=approval-ocg',
  },
  {
    request: 'Vendor DPA - Analytics Platform',
    owner: 'S. Patel',
    due: 'Tomorrow',
    href: '/portal?view=approval-dpa',
  },
  {
    request: 'Marketing Terms Update',
    owner: 'A. Lee',
    due: 'Fri',
    href: '/portal?view=approval-terms',
  },
];

const documents = [
  { name: 'Master Services Agreement Template', team: 'Commercial', updated: 'Today' },
  { name: 'Data Processing Addendum (Global)', team: 'Privacy', updated: 'Yesterday' },
  { name: 'Incident Response Runbook', team: 'Security', updated: '2 days ago' },
  { name: 'Employment Handbook Addendum', team: 'HR Legal', updated: '3 days ago' },
];

const events = [
  { title: 'Litigation team standup', time: '9:30 AM' },
  { title: 'M&A diligence review', time: '11:00 AM' },
  { title: 'Client advisory prep', time: '2:00 PM' },
];

const InternalPortalExample = () => {
  return (
    <section className="bg-background py-14">
      <div className="container space-y-8">
        <div className="border-border bg-background-accent rounded-lg border p-6">
          <p className="text-foreground-light text-sm font-medium">Internal Portal</p>
          <h1 className="text-foreground mt-2 text-3xl font-semibold lg:text-4xl">
            Welcome back, Orrick Legal Operations
          </h1>
          <p className="text-foreground-light mt-3 max-w-3xl">
            Centralize legal workflows, policy updates, approvals, and shared resources in one
            place.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              placeholder="Search matters, templates, policies, or people"
              className="border-border bg-background text-foreground placeholder-foreground-light focus:border-accent focus:ring-accent w-full rounded-md border px-4 py-2.5 text-sm focus:ring-2 focus:outline-none"
            />
            <button className="bg-accent hover:bg-accent-hover rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors">
              Search Portal
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="border-border bg-background rounded-lg border p-6 lg:col-span-2">
            <h2 className="text-foreground text-xl font-semibold">Announcements</h2>
            <ul className="mt-4 space-y-4">
              {announcements.map((item) => (
                <li key={item.title} className="border-border rounded-md border p-4">
                  <h3 className="text-foreground text-base font-semibold">{item.title}</h3>
                  <p className="text-foreground-light mt-1 text-sm">{item.detail}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="border-border bg-background rounded-lg border p-6">
            <h2 className="text-foreground text-xl font-semibold">My Tasks</h2>
            <ul className="mt-4 space-y-3">
              {myTasks.map((task) => (
                <li key={task} className="text-foreground-light flex items-start gap-2 text-sm">
                  <span className="bg-accent mt-1 block h-2 w-2 rounded-full" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="border-border bg-background rounded-lg border p-6 lg:col-span-2">
            <h2 className="text-foreground text-xl font-semibold">Quick Links</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {quickLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.title}
                  className="border-border bg-background-accent hover:border-accent block rounded-md border p-4 transition-colors"
                >
                  <h3 className="text-foreground text-base font-semibold">{link.title}</h3>
                  <p className="text-foreground-light mt-1 text-sm">{link.description}</p>
                  <span className="text-accent mt-3 inline-flex text-xs font-semibold uppercase">
                    Open
                  </span>
                </Link>
              ))}
            </div>
          </article>

          <article className="border-border bg-background rounded-lg border p-6">
            <h2 className="text-foreground text-xl font-semibold">My Approvals</h2>
            <ul className="mt-4 space-y-3">
              {myApprovals.map((item) => (
                <li key={item.request}>
                  <Link
                    href={item.href}
                    className="border-border hover:border-accent block rounded-md border p-3 transition-colors"
                  >
                    <p className="text-foreground text-sm font-medium">{item.request}</p>
                    <p className="text-foreground-light mt-1 text-xs">Owner: {item.owner}</p>
                    <p className="text-accent mt-1 text-xs font-semibold">Due: {item.due}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <article className="border-border bg-background rounded-lg border p-6">
          <h2 className="text-foreground text-xl font-semibold">Today</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {events.map((event) => (
              <li key={event.title} className="border-border rounded-md border p-3">
                <p className="text-foreground text-sm font-medium">{event.title}</p>
                <p className="text-foreground-light text-xs">{event.time}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="border-border bg-background rounded-lg border p-6">
          <h2 className="text-foreground text-xl font-semibold">Shared Documents</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-border border-b text-left">
                  <th className="text-foreground px-2 py-3 text-sm font-semibold">Document</th>
                  <th className="text-foreground px-2 py-3 text-sm font-semibold">Team</th>
                  <th className="text-foreground px-2 py-3 text-sm font-semibold">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.name} className="border-border border-b last:border-0">
                    <td className="text-foreground px-2 py-3 text-sm">{doc.name}</td>
                    <td className="text-foreground-light px-2 py-3 text-sm">{doc.team}</td>
                    <td className="text-foreground-light px-2 py-3 text-sm">{doc.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
};

export default InternalPortalExample;
