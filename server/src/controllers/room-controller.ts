import { rooms, User } from "..";
import Room from "../utils/roomClass";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { generateRoomID } from "../utils/generate-room-id";

export const createRoom = asyncHandler((req: Request, res: Response) => {
  let code: string = "";
  let tryCount = 0;
  const MAX_RETRIES = 100;

  while (tryCount < MAX_RETRIES) {
    tryCount++;
    const id = generateRoomID();
    if (!rooms.has(id)) {
      const username = (req.user as User)?.username;
      if (!username)
        return res.status(401).json({ message: "Login required!" });
      code = id;
      const newRoom = new Room(code, username);
      rooms.set(code, newRoom);
      break;
    }
  }

  if (code === "")
    return res.status(400).json({ message: "Could not create a room" });

  return res.status(200).json({ code, message: "Generated a new Room ID" });
});
