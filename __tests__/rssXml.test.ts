// __tests__/rssXml.test.ts
import { getServerSideProps } from '@/pages/rss.xml';
import { NextApiResponse } from 'next';

describe('RSS XML Page', () => {
  it('should set proper headers and return empty props', async () => {
    // Create a mock response object with jest spies for header and output methods
    const res = {
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as NextApiResponse;

    // Updated context: include required properties for GetServerSidePropsContext
    const context = {
      req: {} as any, // Dummy request object
      res,
      query: {},      // Empty query object as no parameters are needed
      resolvedUrl: '/rss.xml' // Set resolvedUrl to a valid path
    };

    // Call the server side function with the complete context object
    const result = await getServerSideProps(context);

    // Assert that the function returns empty props and sets correct headers
    expect(result).toEqual({ props: {} });
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/xml');
    expect(res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'public, s-maxage=1200, stale-while-revalidate=600'
    );
    expect(res.write).toHaveBeenCalled();
    expect(res.end).toHaveBeenCalled();
  });
});
