// src/types/next.d.ts
import { NextPage } from 'next';
import { AppProps } from 'next/app';

export type PageProps = {
  params: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export type NextPageWithProps<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};