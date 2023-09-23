use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum Error {
    // error 0
    #[error("uninitialized account")]
    UninitializedAccount,
    // error 1
    #[error("Derived PDA did not match the given PDA")]
    InvalidPDA,
    // error 2
    #[error("input data length is too long")]
    InvalidDataLength,
    // error 3
    #[error("rating is out of range 5 or less than 1")]
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
