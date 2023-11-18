import { NextApiRequest, NextApiResponse } from "next";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { randomUUID } from "crypto";

type ResponseError = {
  message: string;
};

type RequestBody = {
  pcdId: string;
};

const getBattleId = randomUUID().replaceAll("-", "");

const createBattle = async (body: RequestBody) => {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
  return await db.run('INSERT INTO "Battle" (id) Values (?)');
};

export default async function proofHandler(
  req: NextApiRequest,
  res: NextApiResponse<any | ResponseError>
) {
  if (req.method === "POST") {
    const { body, query } = req;
    const x = await storeBattle(body);
    return res.status(200).json({ hi: x.lastID });
  } else {
    res.status(405).json({ message: `Method not allowed` });
  }
}
