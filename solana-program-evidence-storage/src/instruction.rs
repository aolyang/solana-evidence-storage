use borsh::{BorshDeserialize};
use solana_program::{msg, program_error::ProgramError};

#[derive(BorshDeserialize)]
struct AddEvidenceStatsPayload {
    file_name: String,
    description: String,
    size: String,
    hash: String,
}
#[derive(BorshDeserialize)]
struct UpdateEvidenceStatsPayload {
    file_name: String,
    description: String,
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
                let payload = AddEvidenceStatsPayload::try_from_slice(rest)
                    .map_err(|_| ProgramError::from(ProgramError::InvalidInstructionData))?;
                Self::AddEvidenceStats {
                    file_name: payload.file_name,
                    description: payload.description,
                    size: payload.size,
                    hash: payload.hash,
                }
            }
            1 => {
                let payload = UpdateEvidenceStatsPayload::try_from_slice(rest)
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