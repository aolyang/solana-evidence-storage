import * as borsh from "@project-serum/borsh"
import {Buffer} from "buffer";

const EvidenceStorageProgramId: string = "6h8ySgSzzc7i5tM8xm8j3uScXmmKbiPKoXrLEWEL1NTe"

const AddEvidenceBorshSchema: borsh.Layout<IEvidence> = borsh.struct([
    borsh.str("file_name"),
    borsh.str("description"),
    borsh.u64("size"),
    borsh.str("hash")
])

const UpdateEvidenceBorshSchema: borsh.Layout<Pick<IEvidence, "file_name" | "description">> = borsh.struct([
    borsh.str("file_name"),
    borsh.str("description")
])

interface IEvidence {
    file_name: string
    description: string
    size: number
    hash: string
}

class Evidence implements IEvidence {
    constructor(
        public file_name: string,
        public description: string,
        public size: number,
        public hash: string
    ) {
    }

    static readonly borshInstructionSchemas = {
        addEvidence: AddEvidenceBorshSchema,
        updateEvidence: UpdateEvidenceBorshSchema
    }

    serialize(type: "add" | "update"): Buffer {
        const buffer = Buffer.alloc(1000)
        const {file_name, description, size, hash} = this

        const bufferSlice = (buffer: Buffer, layout: borsh.Layout<any>) => {
            return Buffer.from(
                Uint8Array.prototype.slice.call(buffer, 0, layout.getSpan(buffer))
            )
        }
        let layout
        if (type === "add") {
            layout = AddEvidenceBorshSchema
            layout.encode({file_name, description, size, hash}, buffer)
        } else {
            layout = UpdateEvidenceBorshSchema
            layout.encode({file_name, description}, buffer)
        }
        return bufferSlice(buffer, layout)
    }

    static deserialize(buffer?: Buffer): Evidence | null {
        if (!buffer) {
            return null
        }

        try {
            const { file_name, description, size, hash } = AddEvidenceBorshSchema.decode(buffer)
            return new Evidence(file_name, description, size, hash)
        } catch (e) {
            console.log('Deserialization error:', e)
            console.log(buffer)
            return null
        }
    }
}
