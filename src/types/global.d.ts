/* eslint-disable no-var */

import { Course } from './types';

declare interface Category {
  id: string;
  name: string;
}

declare interface Tag {
  id: string;
  name: string;
}

declare interface Teacher {
  name: string;
  role: string;
  bio: string;
  image: string;
  languages: string[];
}

declare interface Post {
  title: string;
  coverImage: string;
}

declare type NonEmptyArray<T> = [T, ...T[]];

declare global {
  var courses: Course[];
}
  
export {};