const docToJSON = (doc: any): JSON => {
  return JSON.parse(JSON.stringify(doc));
};

export const UtilityHelper = { docToJSON };
