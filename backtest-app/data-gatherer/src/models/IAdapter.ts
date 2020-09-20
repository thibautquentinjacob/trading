export interface Adapter<TAPI, T> {
    adapt(data: TAPI): T;
}
