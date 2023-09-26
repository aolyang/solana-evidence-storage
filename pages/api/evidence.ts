import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req

    if (method === "POST") {
        
    }

    return res.status(200).json({
        data: null,
        msg: `Method ${method} not implemented`
    })
}
