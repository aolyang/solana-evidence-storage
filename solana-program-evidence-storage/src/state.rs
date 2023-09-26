use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_pack::{IsInitialized, Sealed};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct EvidenceAccountState {
    pub is_initialized: bool,
    pub file_name: String,
    pub description: String,
    pub size: String,
    pub hash: String,
}

impl EvidenceAccountState {
    pub fn get_account_size(file_name: String, description: String, size: String, hash: String) -> usize {
        return 1 + (4 + file_name.len()) + (4 + description.len()) + (4 + size.len()) + (4 + hash.len());
    }
}

impl Sealed for EvidenceAccountState {}

impl IsInitialized for EvidenceAccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized.clone()
    }
}