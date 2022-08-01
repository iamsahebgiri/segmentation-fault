import React from 'react';
import { BaseLayout } from '~/components/layouts/base-layout';
import { classNames } from '~/lib/classnames';
import { Icon } from '@iconify/react';
import location24Filled from '@iconify/icons-fluent/location-24-filled';
import calendarClock24Filled from '@iconify/icons-fluent/calendar-clock-24-filled';
import clock24Filled from '@iconify/icons-fluent/clock-24-filled';

const profile = {
  name: 'Ricardo Cooper',
  imageUrl:
    'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
  coverImageUrl:
    'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  about: `
    <p>Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.</p>
    <p>Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.</p>
  `,
  fields: {
    Phone: '(555) 123-4567',
    Email: 'ricardocooper@example.com',
    Title: 'Senior Front-End Developer',
    Team: 'Product Development',
    Location: 'San Francisco',
    Sits: 'Oasis, 4th floor',
    Salary: '$145,000',
    Birthday: 'June 8, 1990',
  },
};

const tabs = [
  { name: 'Questions', href: '#', count: '52', current: true },
  { name: 'Answers', href: '#', count: '6', current: false },
  { name: 'Badges', href: '#', count: '4', current: false },
  { name: 'Bookmarks', href: '#', current: false },
];

export default function ProfilePage() {
  return (
    <div className="col-span-12">
      <div>
        <div>
          <img
            className="h-32 w-full object-cover lg:h-48"
            src={profile.coverImageUrl}
            alt=""
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <img
                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                src={profile.imageUrl}
                alt=""
              />
            </div>
          </div>
          <div className="mt-6 lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="h-12 w-full col-span-4">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {profile.name}
              </h1>
              <div className="divide-y divide-gray-200 ">
                <div className="mt-4">Student and a developer</div>
                <div className="mt-8 pt-8 flex flex-col sm:space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Icon
                      icon={calendarClock24Filled}
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Member for 6 months
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Icon
                      icon={clock24Filled}
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Last seen this week
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Icon
                      icon={location24Filled}
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Seoul
                  </div>
                </div>
              </div>
            </div>
            <div className="h-12 w-full col-span-8 lg:-mt-16">
              <div className="block">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <a
                        key={tab.name}
                        href="#"
                        className={classNames(
                          tab.current
                            ? 'border-brand-500 text-brand-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                          'whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm',
                        )}
                        aria-current={tab.current ? 'page' : undefined}
                      >
                        {tab.name}
                        {tab.count ? (
                          <span
                            className={classNames(
                              tab.current
                                ? 'bg-brand-100 text-brand-600'
                                : 'bg-gray-100 text-gray-900',
                              'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block',
                            )}
                          >
                            {tab.count}
                          </span>
                        ) : null}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
