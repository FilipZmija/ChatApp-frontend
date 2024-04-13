export type TRoom = {
  name: string;
  id: number;
  type: "room";
  lastActive?: string;
  active?: boolean;
};
export type TRoomCreationData = { name: string; users: number[] };
