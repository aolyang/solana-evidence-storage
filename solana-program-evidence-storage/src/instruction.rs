use borsh::{BorshDeserialize};
use solana_program::{msg, program_error::ProgramError};

#[derive(BorshDeserialize)]
struct EvidenceStatsPayload {
    file_name: String,
    description: String,
    size: String,
    hash: String,
}

pub enum EvidenceInstruction {
    AddEvidenceStats {
        file_name: String,
        description: String,
        size: String,
        hash: String,
    },
    UpdateEvidenceStats {
        file_name: String,
        description: String,
    },
}

impl EvidenceInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;
        msg!("variant: {}", variant);

        Ok(match variant {
            0 => {
                let payload = EvidenceStatsPayload::try_from_slice(rest)
                    .map_err(|_| ProgramError::from(ProgramError::InvalidInstructionData))?;
                Self::AddEvidenceStats {
                    file_name: payload.file_name,
                    description: payload.description,
                    size: payload.size,
                    hash: payload.hash,
                }
            }
            1 => {
                let payload = EvidenceStatsPayload::try_from_slice(rest)
                    .map_err(|_| ProgramError::from(ProgramError::InvalidInstructionData))?;
                Self::UpdateEvidenceStats {
                    file_name: payload.file_name,
                    description: payload.description,
                }
            }
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}