import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req
    const { id } = req.query

    return res.status(200).json({
        data: null,
        msg: `Method ${method} not implemented` + id
    })
}
