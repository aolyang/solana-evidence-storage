import * as borsh from "@project-serum/borsh"
import { Buffer } from "buffer"

const EvidenceBorshSchema: borsh.Layout<IEvidence & { variant: 0 | 1 }> = borsh.struct([
    borsh.u8("variant"),
    borsh.str("file_name"),
    borsh.str("description"),
    borsh.str("size"),
    borsh.str("hash")
])

const getEvidenceBorshSchema: borsh.Layout<IEvidence & { initialized: boolean }> = borsh.struct([
    borsh.bool("initialized"),
    borsh.str("file_name"),
    borsh.str("description"),
    borsh.str("size"),
    borsh.str("hash")
])

interface IEvidence {
    file_name: string
    description: string
    size: string
    hash: string
}

class Evidence implements IEvidence {
    constructor(
        public file_name: string,
        public description: string,
        public size: string,
        public hash: string
    ) {
    }

    serialize(variant: 0 | 1 = 0): Buffer {
        const buffer = Buffer.alloc(1000)
        const { file_name, description, size, hash } = this

        const bufferSlice = (buffer: Buffer, layout: borsh.Layout<any>) => {
            return Buffer.from(
                buffer.slice(0, layout.getSpan(buffer))
            )
        }
        EvidenceBorshSchema.encode({ variant, file_name, description, size, hash }, buffer)
        return bufferSlice(buffer, EvidenceBorshSchema)
    }

    static deserialize(buffer?: Buffer): Evidence | null {
        if (!buffer) {
            return null
        }

        try {
            const { file_name, description, size, hash } = getEvidenceBorshSchema.decode(buffer)
            return new Evidence(file_name, description, size, hash)
        } catch (e) {
            console.log("Deserialization error:", e)
            console.log(buffer)
            return null
        }
    }
}

export type {
    IEvidence

}
export {
    Evidence
}
