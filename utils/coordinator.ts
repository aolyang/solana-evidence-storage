import base58 from "bs58"
import * as web3 from "@solana/web3.js"

import { Evidence, IEvidence } from "@/definitions/instruction"
import { ProgramId } from "@/definitions/program"

class ProgramCoordinator {
    static accounts: web3.PublicKey[] = []

    static async prefetchAccounts(connection: web3.Connection, search: string) {
        const accounts = await connection.getProgramAccounts(
            new web3.PublicKey(ProgramId),
            {
                // dataSlice: { offset: 0, length: 18 },
                filters: search === "" ? [] : [
                    {
                        memcmp: {
                            offset: 0,
                            bytes: base58.encode(Buffer.from(search))
                        }
                    }
                ]
            }
        )

        this.accounts = accounts.map(account => account.pubkey)
    }

    static async fetchEvidences(connection: web3.Connection, page: number, perPage: number, search: string, reload = false): Promise<IEvidence[]> {
        if (this.accounts.length === 0 || reload) {
            await this.prefetchAccounts(connection, search)
        }

        const paginatedPublicKeys = this.accounts

        if (paginatedPublicKeys.length === 0) {
            return []
        }

        const accounts = await connection.getMultipleAccountsInfo(paginatedPublicKeys)

        return accounts.reduce((accum: IEvidence[], account) => {
            const evidence = Evidence.deserialize(account?.data)
            if (!evidence) return accum

            return accum.concat(evidence)
        }, [])
    }
}

export default ProgramCoordinator
