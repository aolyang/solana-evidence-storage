use thiserror::Error;
use solana_program::program_error::ProgramError;

#[derive(Error, Debug)]
pub enum Error {
    // error 0
    #[error("uninitialized account")]
    UninitializedAccount,
    // error 1
    #[error("Derived PDA did not match the given PDA")]
    InvalidPDA,
    // error 2
    #[error("Input data length is too long")]
    InvalidDataLength,
    // error 3
    #[error("Invalid file size")]
    InvalidFileSize,
    #[error("Invalid Instruction")]
    InvalidInstruction,
    #[error("parse evidence stats info payload failed")]
    ParseEvidenceStatsFailed,
    #[error("convert usize to u64 failed")]
    ConvertUsizeToU64Failed,
}

impl From<Error> for ProgramError {
    fn from(value: Error) -> Self {
        ProgramError::Custom(value as u32)
    }
}
