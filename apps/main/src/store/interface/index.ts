
/* DistState */
export interface DistState {
  dictArr: {
    [propName: string]: any[];
  };
  dictMap: {
    [propName: string]: {
      [propName: string]: any;
    };
  }
}
