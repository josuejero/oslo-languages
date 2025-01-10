// src/types/next.d.ts
import { NextPage } from 'next';

export type PageProps = {
  params: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export type NextPageWithProps<P extends Record<string, unknown> = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};