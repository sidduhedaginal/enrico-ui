export interface sowAction {
  customerTypeName: string;
  sowJdTypeName: string;
  customerName: string;
}

export interface sowActionStatus extends sowAction {
  statusName: string;
}
