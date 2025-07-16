export type Simulation = {
  success: false;
  call: {
    chainid: number;
    to: Address;
    value: string;
    data: Hex;
  };
  details: {
    blockNumber: string;
    relayer: string;
  };
};
