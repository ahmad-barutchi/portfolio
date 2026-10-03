/**
 * “Rescue robot” case study (final-year project, 2022) in English: same shape
 * as case-robot.ts. Image file names are shared; captions and alt texts are
 * translated.
 */
import * as fr from './case-robot';
import type { CaseFact, CaseSection } from './case-robot';
import { FEATURED_PROJECT } from './site.en';

export { splitCode, frenchSpacing } from './case-robot';

export const CASE_ROBOT: typeof fr.CASE_ROBOT = {
  ...fr.CASE_ROBOT,
  slug: FEATURED_PROJECT.slug,
  href: FEATURED_PROJECT.href,
  pageTitle: 'Rescue robot — Ahmad Barutchi',
  description:
    'Case study: Ahmad Barutchi’s final-year project (2022), a rescue robot and a web and mobile app to monitor the data it generates (IoT).',
  titleStart: 'Prototyping a rescue',
  titleEm: 'robot',
  kind: 'Final project 2022',
  team: 'Duo',
  readingTime: '3 min read',
  summary: 'Building a robot and a web and mobile app to monitor the data it generates (IoT).',
  stack: [
    { name: 'Python', role: 'Flask, PyMongo, JWT, unittest' },
    { name: 'Angular 13+', role: 'Akveo’s ngx-admin template' },
    { name: 'Arduino', role: 'Robot control module' },
    { name: 'Swagger', role: 'Flask API documentation' },
    { name: 'MongoDB', role: 'Database' },
    { name: 'Capacitor', role: 'Android app' },
  ],
};

export const CASE_FACTS: readonly CaseFact[] = [
  { label: 'Team', value: `${CASE_ROBOT.members[0]} and ${CASE_ROBOT.members[1]}` },
  { label: 'Method', value: CASE_ROBOT.method },
  { label: 'Year', value: `${CASE_ROBOT.year} · Final-year project` },
  { label: 'Code', value: CASE_ROBOT.repoLabel, href: CASE_ROBOT.repo },
];

export const CASE_SECTIONS: readonly CaseSection[] = [
  {
    id: 'context',
    level: 2,
    title: 'Context',
    paragraphs: [
      'The goal of the project is to build the robot and a web and mobile application to monitor the data it generates (IoT). The application is based on the ngx-admin monitoring template.',
    ],
  },
  {
    id: 'stack',
    level: 2,
    title: 'Stack',
    kind: 'stack',
    paragraphs: [],
  },
  {
    id: 'software',
    level: 2,
    title: 'Software',
    paragraphs: [],
  },
  {
    id: 'ngx-admin',
    level: 3,
    title: 'Ngx-admin',
    paragraphs: [
      'To build the web application, we first had to choose the tools and the framework. Several monitoring solutions exist; rather than reinvent the wheel, we turned to Akveo’s admin dashboards, which handle data monitoring and accept any kind of component.',
      'Ngx-admin is a free, open-source Angular template made by Akveo, built on Angular 13+ with the Eva Design System and Nebular.',
    ],
  },
  {
    id: 'users',
    level: 3,
    title: 'User management',
    toc: 'Users',
    paragraphs: [
      'To reach the dashboard, which gives access to the data from the robot’s search sessions, users first land on a sign-in / sign-up page.',
      'Administrators get a dedicated view that sets them apart from client users; passwords stored in MongoDB are hashed with SHA-256 and SHA-512.',
    ],
    figures: [
      {
        after: 0,
        images: [{ name: 'login', alt: 'Dashboard sign-in and sign-up page' }],
        caption: 'Dashboard sign-in and sign-up page',
      },
      {
        images: [
          { name: 'admin-hash', alt: 'Administrator view and sample hashed passwords in MongoDB' },
        ],
        caption: 'Administrator view and sample hashed passwords in MongoDB',
      },
    ],
  },
  {
    id: 'visualisation',
    level: 3,
    title: 'Visualisation',
    paragraphs: [
      'A chart compares the values measured by the robot (front temperature, rear temperature, ambient temperature, humidity) with prediction curves for a living presence or a potential source of fire or flooding. The coloured buttons filter the curves.',
      'The data is also shown in a table, searchable by category or value: users focus on the “Origin” column to see whether it is a human being or a fire (all the logic lives in the back end), then check the GPS position, the detection time and the probabilities; a higher probability is handled first.',
      'Sessions can be viewed or deleted.',
    ],
    figures: [
      {
        after: 0,
        images: [
          {
            name: 'graphe-predictions',
            alt: 'Chart comparing the temperatures and humidity measured by the robot with the prediction curves',
          },
        ],
        caption:
          'Chart comparing the temperatures and humidity measured by the robot with the prediction curves',
      },
      {
        after: 1,
        images: [
          {
            name: 'tableau-detections',
            alt: 'Detections table with the Origin column, GPS position, time and probabilities',
          },
        ],
        caption: 'Detections table with the Origin column, GPS position, time and probabilities',
      },
      {
        images: [{ name: 'seances', alt: 'Search session management' }],
        caption: 'Search session management',
      },
    ],
  },
  {
    id: 'jwt',
    level: 3,
    title: 'JWT',
    paragraphs: [
      'JSON Web Tokens secure the API: the server returns a token that users include in their requests to prove their identity.',
    ],
    figures: [
      {
        images: [{ name: 'jwt', alt: 'API response containing a JWT token' }],
        caption: 'API response containing a JWT token',
      },
    ],
  },
  {
    id: 'swagger',
    level: 3,
    title: 'Swagger',
    paragraphs: [
      'Swagger describes the structure of the API and lists all its routes.',
      'It shows the request URL, the equivalent curl command and the JSON response (code 200), for example when testing the `POST /login` route.',
    ],
    figures: [
      {
        after: 0,
        images: [{ name: 'swagger-routes', alt: 'List of API routes in Swagger' }],
        caption: 'List of API routes in Swagger',
      },
      {
        images: [{ name: 'swagger-login', alt: 'Testing the POST /login route in Swagger' }],
        caption: 'Testing the POST /login route in Swagger',
      },
    ],
  },
  {
    id: 'mobile',
    level: 3,
    title: 'Mobile app',
    toc: 'Mobile',
    paragraphs: [
      'An Android app was generated with Capacitor, a cross-platform native runtime that runs modern web apps natively on iOS and Android.',
      'In the chart, the time scale can be zoomed in.',
    ],
    figures: [
      {
        layout: 'phones',
        images: [
          { name: 'android-1', alt: 'Android app, first screen' },
          { name: 'android-2', alt: 'Android app, second screen' },
          { name: 'android-3', alt: 'Android app, third screen' },
        ],
        caption: 'Android app screenshots (three screens)',
      },
    ],
  },
  {
    id: 'hardware',
    level: 2,
    title: 'Hardware',
    paragraphs: ['On the hardware side, the robot is driven by an Arduino control module.'],
    figures: [
      {
        images: [{ name: 'schema-electrique', alt: 'Robot wiring diagram' }],
        caption: 'Robot wiring diagram',
      },
    ],
  },
  {
    id: 'team',
    level: 2,
    title: 'Team and method',
    toc: 'Team',
    paragraphs: [
      'A pair project with Younes Zahouane; tasks were split using the Kanban agile method.',
    ],
  },
];

/** English text needs no typographic adjustment. */
export const typeset = (text: string): string => text;
