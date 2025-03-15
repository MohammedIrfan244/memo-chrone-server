export const myLogger = (message: string, data?: unknown) => {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (isDevelopment) {
    console.log(message, data);
  } else {
    return;
  }
};
