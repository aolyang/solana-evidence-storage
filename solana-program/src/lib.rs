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

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    msg!("hello world");
    let instruction = instruction::EvidenceInstruction::unpack(instruction_data)?;

    Ok(())
}