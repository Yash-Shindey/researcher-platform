export interface Researcher {
  _id: string;
  authfull: string;
  inst_name: string;
  cntry: string;
  metrics: {
    h23: number;
    nc9623: number;
    selfCitationExcluded: {
      h23: number;
      nc9623: number;
    };
  };
  fields: {
    primary: {
      name: string;
      rank: number;
    };
    secondary: Array<{
      name: string;
      fraction: number;
    }>;
  };
}
