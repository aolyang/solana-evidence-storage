extern crate borsh;
extern crate thiserror;
extern crate solana_program;

mod instruction;
mod processor;
mod state;
mod error;

use solana_program::{
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    account_info::AccountInfo,
};
use crate::instruction::EvidenceInstruction;
use crate::processor::{add_evidence_stats, update_evidence_info};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("hello evidence storage");
    let instruction = EvidenceInstruction::unpack(instruction_data)?;

    match instruction {
        EvidenceInstruction::AddEvidenceStats {
            file_name,
            description,
            size,
            hash,
        } => add_evidence_stats(program_id, accounts, file_name, description, size, hash),
        EvidenceInstruction::UpdateEvidenceStats {
            file_name,
            description,
        } => update_evidence_info(program_id, accounts, file_name, description),
    }
}