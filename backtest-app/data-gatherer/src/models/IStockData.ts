export interface IStockData {
    [key: string]:
        | string
        | {
              [key: string]: number[];
          }
        | Date[]
        | string[]
        | number[];
}
