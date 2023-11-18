import { NextApiRequest, NextApiResponse } from "next";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { randomUUID } from "crypto";

type ResponseError = {
  message: string;
};

type RequestBody = {
  pcdId: string;
  imgUrl: string;
};

const createBattle = async (body: RequestBody) => {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
  const newBattleId = randomUUID().replaceAll("-", "");
  return {
    result: await db.run('INSERT INTO "Battle" (id, pcdId, frogImgUrl) Values (?, ?, ?)', newBattleId, body.pcdId, body.imgUrl),
    battleId: newBattleId
    };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ResponseError>
) {
  const { slug } = req.query;
  if(slug === 'new' && req.method === "POST") {
    const { body } = req;
    const { battleId, result } = await createBattle(body);
    return res.status(200).json({ battleId});
  }
  } else {
    res.status(405).json({ message: `Method not allowed` });
  }
}
