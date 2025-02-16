// src/__mocks__/remark.ts
export const remark = () => ({
  use: () => ({
    process: (content: string) => Promise.resolve({ toString: () => content })
  })
});

export default () => () => {};
