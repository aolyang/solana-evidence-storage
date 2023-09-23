use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_pack::IsInitialized;
use solana_program::program_pack::Sealed;


#[derive(BorshSerialize, BorshDeserialize)]
pub struct EvidenceAccountState {
    pub is_initialized: bool,
    pub file_name: String,
    pub description: String,
    pub size: u64,
    pub hash: String,
}

impl Sealed for EvidenceAccountState {}

impl IsInitialized for EvidenceAccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized.clone()
    }
}