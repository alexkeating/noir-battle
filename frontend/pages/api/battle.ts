import { NextApiRequest, NextApiResponse } from 'next'
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

type ResponseError = {
  message: string;
}

const storeBattle = async (body: any) => {
   const db = await open({
      filename: '/home/keating/programming/open-source/noir-battle/frontend/noir.db',
      driver: sqlite3.Database
    })
		return await db.run('INSERT INTO "Battle" (id) Values (?)', body.id)
}

export default async function proofHandler(
  req: NextApiRequest,
  res: NextApiResponse< any | ResponseError>
) {
	if (req.method === 'POST') {
		const { body } = req
		const x = await storeBattle(body)
		return res.status(200).json({hi: x.lastID})
	} else {
		res.status(405).json({ message: `Method not allowed` })
	}
}
