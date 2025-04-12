export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export const getISTDate = () => {
  const date = new Date();
  const offset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  return new Date(date.getTime() + offset); // Adjust the date for IST
};
