import { type IBlogType } from "@/types/blog-type";

const blogData: IBlogType[] = [
  {
    id: 1,
    img: '/images/blog/blog-big-3.jpg',
    date: 'July 21, 2023',
    author: 'John Smith',
    comments: 2,
    tags: ["Fashion", "Lift Style", "News"],
    category: 'Beauty',
    title: 'How to Clean Your Home Faster and More Efficiently',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat',
    blog: 'blog-postbox'
  },
  {
    id: 2,
    img: '/images/blog/blog-big-2.jpg',
    date: 'April 18, 2023',
    author: 'Mark Smith',
    comments: 5,
    tags: ["Fashion", "Lift Style", "News"],
    category: 'Beauty',
    title: 'Four Ways a Clean Workplace Makes Employees Happy and Healthy',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat',
    video: true,
    video_id: '457mlqV1gzA',
    blog: 'blog-postbox'
  },
  {
    id: 3,
    date: 'March 15, 2023',
    author: 'Shahnewaz Sakil',
    comments: 8,
    tags: ["Fashion", "Lift Style", "News"],
    category: 'Beauty',
    title: 'Only one thing is impossible for God: To find any sense in any copyright law on the planet.',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat',
    blockquote: true,
    blog: 'blog-postbox'
  },
  {
    id: 4,
    date: 'January 20, 2023',
    author: 'Salim Rana',
    comments: 10,
    tags: ["Fashion", "Lift Style", "News"],
    category: 'Beauty',
    title: 'Time for Spring Cleaning? Use These Tips From the Professionals',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat',
    audio: true,
    audio_id: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/316547873&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
    blog: 'blog-postbox'
  },
  {
    id: 5,
    slider: true,
    slider_images: ['/images/blog/blog-big-4.jpg', '/images/blog/blog-big-5.jpg', '/images/blog/blog-big-6.jpg'],
    date: 'February 20, 2023',
    author: 'Smith Mark',
    comments: 12,
    tags: ["Fashion", "Lift Style", "News"],
    category: 'Beauty',
    title: 'Time for Spring Cleaning? Use These Tips From the Professionals',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat',
    blog: 'blog-postbox'
  },
];

export default blogData;