export const getEnvVar = (name) => {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Env variable ${name} is required`);
    }
    return value;
  };
  
  