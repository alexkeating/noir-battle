import { NextApiRequest, NextApiResponse } from 'next'
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

type ResponseError = {
  message: string;
}

const storeProof = async (body: any) => {
   const db = await open({
      filename: '/tmp/noir.db',
      driver: sqlite3.Database
    })
		return await db.run('INSERT INTO "Proof" (proof, battleId) VALUES (?, ?)', body.proof, body.battleId)
}

export default async function proofHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseError>
) {
	if (req.method === 'POST') {
		const { body } = req
		const x = await storeProof(body)
		return res.status(200).json({hi: x.lastID})
	} else {
		res.status(405).json({ message: `Method not allowed` })
	}
}
