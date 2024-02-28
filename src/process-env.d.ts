declare global {
  interface process {
    env: {
      REACT_APP_API_URL: string;
    };
  }
}
export {};
